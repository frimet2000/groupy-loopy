import { base44 } from '../api/base44Client';

export const seedGermanTrips = async (onStatusUpdate) => {
  const today = new Date();
  const nextMonth = new Date(today);
  nextMonth.setDate(today.getDate() + 30); // Start in a month

  const trips = [
    // --- Singles (Multi-day / Challenging) ---
    {
      title: "Westweg - Abenteuer im Schwarzwald",
      description: "Der Klassiker unter den deutschen Fernwanderwegen. Wir durchqueren den Schwarzwald von Pforzheim nach Basel. Dichte Wälder, offene Hochflächen und atemberaubende Ausblicke erwarten uns. Ideal für Naturliebhaber, die Ruhe und Herausforderung suchen.",
      location: "Feldberg, Baden-Württemberg",
      country: "germany",
      region: "Baden-Württemberg",
      latitude: 47.8762,
      longitude: 8.0025,
      duration_type: 'multi_day',
      duration_value: 5,
      activity_type: 'trek',
      difficulty: 'hard',
      trip_character: ['nature', 'forest', 'challenge'],
      trail_type: ['marked'],
      trek_days: Array(5).fill({
        start_point: "Hütte",
        end_point: "Hütte",
        distance_km: 20,
        elevation_gain_m: 600,
        difficulty: "hard"
      }),
      image_url: "https://images.unsplash.com/photo-1516214104703-d870798883c5?auto=format&fit=crop&q=80&w=1000", // Black Forest
      max_participants: 10,
      start_delay_days: 0 // Starts exactly in a month
    },
    {
      title: "Malerweg - Sächsische Schweiz",
      description: "Eine der spektakulärsten Wanderrouten Deutschlands. Bizarre Felsformationen, tiefe Schluchten und majestätische Tafelberge. Wir folgen den Spuren der Romantiker durch das Elbsandsteingebirge.",
      location: "Bad Schandau, Sachsen",
      country: "germany",
      region: "Sachsen",
      latitude: 50.9167,
      longitude: 14.1500,
      duration_type: 'multi_day',
      duration_value: 4,
      activity_type: 'trek',
      difficulty: 'moderate',
      trip_character: ['rocks', 'views', 'history'],
      trail_type: ['marked', 'stairs'],
      trek_days: Array(4).fill({
        start_point: "Gasthof",
        end_point: "Gasthof",
        distance_km: 15,
        elevation_gain_m: 500,
        difficulty: "moderate"
      }),
      image_url: "https://images.unsplash.com/photo-1465311440653-ba9bb6f9a61d?auto=format&fit=crop&q=80&w=1000", // Saxon Switzerland
      max_participants: 12,
      start_delay_days: 15
    },
    {
      title: "Zugspitze - Gipfelsturm",
      description: "Für erfahrene Bergsteiger: Der Aufstieg auf Deutschlands höchsten Berg. Wir wählen die Route durch das Reintal, eine landschaftlich großartige und abwechslungsreiche Tour. Kondition und Trittsicherheit sind erforderlich.",
      location: "Garmisch-Partenkirchen, Bayern",
      country: "germany",
      region: "Bayern",
      latitude: 47.4211,
      longitude: 10.9853,
      duration_type: 'multi_day',
      duration_value: 3,
      activity_type: 'trek',
      difficulty: 'hard',
      trip_character: ['mountains', 'alpine', 'challenge'],
      trail_type: ['technical'],
      trek_days: Array(3).fill({
        start_point: "Hütte",
        end_point: "Gipfel",
        distance_km: 12,
        elevation_gain_m: 1000,
        difficulty: "very_hard"
      }),
      image_url: "https://images.unsplash.com/photo-1549221539-58a98b4c2b9a?auto=format&fit=crop&q=80&w=1000", // Alps/Zugspitze
      max_participants: 8,
      start_delay_days: 45
    },

    // --- Families (Relaxed / Culture / Nature) ---
    {
      title: "Märchenhafter Harz - Brocken & Dampflok",
      description: "Ein magisches Erlebnis für die ganze Familie. Wir wandern auf den Spuren von Hexen und Mythen durch den Harz und fahren mit der historischen Dampflokomotive auf den Brocken.",
      location: "Wernigerode, Sachsen-Anhalt",
      country: "germany",
      region: "Sachsen-Anhalt",
      latitude: 51.8333,
      longitude: 10.7833,
      duration_type: 'full_day',
      duration_value: 1,
      activity_type: 'hiking',
      difficulty: 'easy',
      trip_character: ['family', 'history', 'trains'],
      trail_type: ['marked', 'forest'],
      itinerary: [
        { time: "09:00", description: "Treffen am Bahnhof Wernigerode", location: "Bahnhof" },
        { time: "10:30", description: "Fahrt mit der Brockenbahn", location: "Zug" },
        { time: "12:00", description: "Wanderung auf dem Gipfelrundweg", location: "Brocken" },
        { time: "15:00", description: "Rückkehr und Eis essen", location: "Altstadt" }
      ],
      image_url: "https://images.unsplash.com/photo-1606254701255-a0d0e1944112?auto=format&fit=crop&q=80&w=1000", // Harz/Train
      max_participants: 20,
      start_delay_days: 10
    },
    {
      title: "Bodensee - Radeln & Baden",
      description: "Entspannte Radtour entlang des Bodenseeufers. Wir besuchen die Blumeninsel Mainau und genießen das kühle Nass. Perfekt für Familien mit Kindern.",
      location: "Konstanz, Baden-Württemberg",
      country: "germany",
      region: "Baden-Württemberg",
      latitude: 47.6603,
      longitude: 9.1758,
      duration_type: 'full_day',
      duration_value: 1,
      activity_type: 'cycling',
      difficulty: 'easy',
      trip_character: ['water', 'cycling', 'family'],
      trail_type: ['paved'],
      itinerary: [
        { time: "10:00", description: "Start in Konstanz", location: "Hafen" },
        { time: "11:30", description: "Besuch Insel Mainau", location: "Mainau" },
        { time: "14:00", description: "Picknick am See", location: "Ufer" }
      ],
      image_url: "https://images.unsplash.com/photo-1563811855-83e9206d4e28?auto=format&fit=crop&q=80&w=1000", // Lake Constance
      max_participants: 25,
      start_delay_days: 30
    },
    {
      title: "Bayerischer Wald - Wipfelweg",
      description: "Natur pur im Nationalpark Bayerischer Wald. Wir spazieren über den Baumwipfelpfad und beobachten Tiere im Freigehege. Ein spannender Tag für kleine Entdecker.",
      location: "Neuschönau, Bayern",
      country: "germany",
      region: "Bayern",
      latitude: 48.8893,
      longitude: 13.4735,
      duration_type: 'full_day',
      duration_value: 1,
      activity_type: 'hiking',
      difficulty: 'easy',
      trip_character: ['nature', 'animals', 'family'],
      trail_type: ['boardwalk'],
      itinerary: [
        { time: "09:30", description: "Eingang Baumwipfelpfad", location: "Parkplatz" },
        { time: "11:00", description: "Aussichtsturm", location: "Turm" },
        { time: "13:00", description: "Tierfreigehege", location: "Wald" }
      ],
      image_url: "https://images.unsplash.com/photo-1545654378-011850125576?auto=format&fit=crop&q=80&w=1000", // Forest/Bavaria
      max_participants: 30,
      start_delay_days: 55
    }
  ];

  let successCount = 0;
  
  for (const trip of trips) {
    try {
      if (onStatusUpdate) onStatusUpdate(`Creating: ${trip.title}...`);
      
      const tripDate = new Date(nextMonth);
      tripDate.setDate(nextMonth.getDate() + trip.start_delay_days);
      
      const tripData = {
        ...trip,
        date: tripDate.toISOString(),
        registration_start_date: new Date().toISOString(),
        status: 'open',
        meeting_time: "09:00",
        current_participants: 0,
        participants: [],
        organizer_waiver_accepted: true,
        organizer_waiver_timestamp: new Date().toISOString(),
        payment_settings: {
          enabled: false,
          currency: 'EUR',
          base_registration_fee: 0,
          payment_methods: [],
        },
        budget: {
          solo_min: null,
          solo_max: null,
          family_min: null,
          family_max: null,
          currency: 'EUR',
          notes: ''
        }
      };
      
      // Remove helper fields
      delete tripData.start_delay_days;

      await base44.entities.Trip.create(tripData);
      successCount++;
    } catch (error) {
      console.error(`Failed to create trip ${trip.title}:`, error);
      if (onStatusUpdate) onStatusUpdate(`Error: ${error.message}`);
    }
  }

  return successCount;
};
