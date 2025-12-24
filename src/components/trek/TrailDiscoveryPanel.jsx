import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bike, Route as RouteIcon, Search, Loader2 } from "lucide-react";
import osmtogeojson from "osmtogeojson";
import GPX from "gpxparser";
import { toast } from "sonner";

export default function TrailDiscoveryPanel({ isOpen, onOpenChange, getBounds, onTrailSelected, mapProvider }) {
  const [loading, setLoading] = useState(false);
  const [trails, setTrails] = useState([]);
  const [gpxUrl, setGpxUrl] = useState("");
  const [loadingGpx, setLoadingGpx] = useState(false);

  const fetchTrails = async () => {
    const bbox = getBounds?.();
    if (!bbox) {
      toast.error("Cannot get current map bounds");
      return;
    }
    const { south, west, north, east } = bbox;
    const query = `[
      out:json
    ][timeout:25];
    (
      relation["route"~"^(hiking|foot)$"](${south},${west},${north},${east});
      relation["route"~"^(bicycle|mtb)$"](${south},${west},${north},${east});
    );
    out tags center bb;`;

    try {
      setLoading(true);
      const res = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
      const data = await res.json();
      const items = (data.elements || [])
        .filter((e) => e.type === "relation")
        .map((e) => ({
          id: e.id,
          name: e.tags?.name || e.tags?.ref || `OSM #${e.id}`,
          type: e.tags?.route || "",
          distance: e.tags?.distance || e.tags?.length || null,
        }));
      setTrails(items);
    } catch (e) {
      toast.error("Overpass error");
    } finally {
      setLoading(false);
    }
  };

  const previewTrail = async (trail) => {
    const query = `[
      out:json
    ][timeout:25];
    relation(${trail.id});
    (._;>;);
    out geom;`;
    try {
      setLoading(true);
      const res = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
      const data = await res.json();
      const geojson = osmtogeojson(data);
      onTrailSelected?.(geojson, { id: trail.id, name: trail.name, type: trail.type, distance: trail.distance });
    } catch (e) {
      toast.error("Failed to load trail geometry");
    } finally {
      setLoading(false);
    }
  };

  const loadGpx = async () => {
    if (!gpxUrl.trim()) return;
    try {
      setLoadingGpx(true);
      const res = await fetch(gpxUrl);
      if (!res.ok) throw new Error("fetch failed");
      const text = await res.text();
      const gpx = new GPX();
      gpx.parse(text);
      const coords = [];
      gpx.tracks.forEach((t) => {
        t.points.forEach((p) => coords.push([p.lon, p.lat]));
      });
      if (coords.length === 0) throw new Error("No points in GPX");
      const geojson = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: { source: "gpx" },
            geometry: { type: "LineString", coordinates: coords },
          },
        ],
      };
      onTrailSelected?.(geojson, { name: gpxUrl.split("/").pop() || "GPX", type: "gpx" });
    } catch (e) {
      toast.error("Failed to load GPX");
    } finally {
      setLoadingGpx(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-96">
        <SheetHeader>
          <SheetTitle>Find Nearby Trails</SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-3">
          <div className="flex gap-2">
            <Button onClick={fetchTrails} className="gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Search in this area
            </Button>
          </div>

          <div className="pt-2 border-t">
            <div className="text-sm font-medium mb-2">Results</div>
            <ScrollArea className="h-64 rounded-md border">
              <div className="p-2 space-y-2">
                {trails.length === 0 && !loading && (
                  <div className="text-sm text-gray-500">No trails yet. Try searching.</div>
                )}
                {trails.map((t) => (
                  <div key={t.id} className="flex items-center justify-between bg-white rounded-md border p-2">
                    <div className="flex items-center gap-2">
                      {(t.type === "bicycle" || t.type === "mtb") ? (
                        <Bike className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <RouteIcon className="w-4 h-4 text-emerald-600" />
                      )}
                      <div>
                        <div className="text-sm font-medium">{t.name}</div>
                        <div className="text-xs text-gray-500">{t.type || "trail"}{t.distance ? ` • ${t.distance}` : ""}</div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => previewTrail(t)}>
                      Preview
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="pt-2 border-t space-y-2">
            <div className="text-sm font-medium">Load GPX by URL</div>
            <div className="flex gap-2">
              <Input value={gpxUrl} onChange={(e) => setGpxUrl(e.target.value)} placeholder="https://example.com/route.gpx" />
              <Button onClick={loadGpx} disabled={loadingGpx} className="bg-emerald-600 hover:bg-emerald-700">
                {loadingGpx ? <Loader2 className="w-4 h-4 animate-spin" /> : "Load"}
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}