import { base44 } from '../api/base44Client';

export const seedFrenchTrips = async (onStatusUpdate) => {
  const today = new Date();
  const twoMonthsFromNow = new Date(today);
  twoMonthsFromNow.setDate(today.getDate() + 60); // Start in roughly 2 months

  const trips = [
    // --- Iconic Multi-day ---
    {
      title: "Tour du Mont Blanc",
      description: "Le tour classique du Mont Blanc. Des paysages alpins spectaculaires, traversant la France, l'Italie et la Suisse. Une aventure inoubliable pour les randonneurs expérimentés.",
      location: "Chamonix, Auvergne-Rhône-Alpes",
      country: "france",
      region: "Alps",
      latitude: 45.9237,
      longitude: 6.8694,
      duration_type: 'multi_day',
      duration_value: 10,
      activity_type: 'trek',
      difficulty: 'hard',
      trip_character: ['mountains', 'nature', 'challenge'],
      trail_type: ['marked'],
      trek_days: Array(10).fill({
        start_point: "Refuge",
        end_point: "Refuge",
        distance_km: 15,
        elevation_gain_m: 800,
        difficulty: "hard"
      }),
      image_url: "https://images.unsplash.com/photo-1533378546123-26154563a925?auto=format&fit=crop&q=80&w=1000", // French Alps
      max_participants: 12,
      start_delay_days: 0
    },
    // --- City/Cultural ---
    {
      title: "Paris - Secrets de la Ville Lumière",
      description: "Une exploration urbaine de Paris, loin des sentiers battus. Montmartre caché, passages couverts et parcs méconnus.",
      location: "Paris, Île-de-France",
      country: "france",
      region: "Île-de-France",
      latitude: 48.8566,
      longitude: 2.3522,
      duration_type: 'full_day',
      duration_value: 1,
      activity_type: 'hiking',
      difficulty: 'easy',
      trip_character: ['culture', 'history', 'urban'],
      trail_type: ['paved'],
      image_url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=1000", // Paris
      max_participants: 20,
      start_delay_days: 5
    },
    // --- Nature/Scenic ---
    {
      title: "Provence - Champs de Lavande",
      description: "Balade photographique et sensorielle à travers les champs de lavande en fleurs. Visite de villages perchés du Luberon.",
      location: "Gordes, Provence-Alpes-Côte d'Azur",
      country: "france",
      region: "Provence",
      latitude: 43.9113,
      longitude: 5.1977,
      duration_type: 'full_day',
      duration_value: 1,
      activity_type: 'hiking',
      difficulty: 'easy',
      trip_character: ['nature', 'scenic', 'culture'],
      trail_type: ['dirt_road'],
      image_url: "https://images.unsplash.com/photo-1563286384-257a0753880e?auto=format&fit=crop&q=80&w=1000", // Lavender
      max_participants: 15,
      start_delay_days: 10
    },
    {
      title: "Châteaux de la Loire - Vélo et Histoire",
      description: "Randonnée à vélo le long de la Loire, à la découverte des majestueux châteaux de la Renaissance. Chambord, Chenonceau et jardins royaux.",
      location: "Blois, Centre-Val de Loire",
      country: "france",
      region: "Loire Valley",
      latitude: 47.5861,
      longitude: 1.3359,
      duration_type: 'multi_day',
      duration_value: 4,
      activity_type: 'cycling',
      difficulty: 'moderate',
      trip_character: ['history', 'architecture', 'nature'],
      trail_type: ['paved', 'gravel'],
      trek_days: Array(4).fill({
        start_point: "Hôtel",
        end_point: "Hôtel",
        distance_km: 40,
        elevation_gain_m: 100,
        difficulty: "moderate"
      }),
      image_url: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&q=80&w=1000", // Chambord/Loire
      max_participants: 10,
      start_delay_days: 15
    }
  ];

  let createdCount = 0;
  
  if (onStatusUpdate) onStatusUpdate(`Found ${trips.length} trips to seed...`);

  // Get current user for organizer info
  let user;
  try {
    user = await base44.auth.me();
  } catch (e) {
    console.error("Not authenticated");
    return 0;
  }

  for (const trip of trips) {
    try {
      const tripDate = new Date(twoMonthsFromNow);
      tripDate.setDate(twoMonthsFromNow.getDate() + (trip.start_delay_days || 0));
      
      // Calculate registration start (1 month before trip)
      const regDate = new Date(tripDate);
      regDate.setMonth(regDate.getMonth() - 1);

      const tripData = {
        ...trip,
        date: tripDate.toISOString(),
        registration_start_date: regDate.toISOString(),
        meeting_time: "09:00",
        status: 'open',
        organizer_name: user.first_name ? `${user.first_name} ${user.last_name}` : (user.full_name || 'System Admin'),
        organizer_email: user.email,
        current_participants: 0,
        participants: [], // Empty initially
        organizer_waiver_accepted: true,
        organizer_waiver_timestamp: new Date().toISOString()
      };

      // Remove helper fields
      delete tripData.start_delay_days;

      await base44.entities.Trip.create(tripData);
      createdCount++;
      if (onStatusUpdate) onStatusUpdate(`Created: ${trip.title}`);
      
      // Add a small delay to not overwhelm the API
      await new Promise(r => setTimeout(r, 500));
    } catch (error) {
      console.error(`Error creating trip ${trip.title}:`, error);
      if (onStatusUpdate) onStatusUpdate(`Error creating ${trip.title}: ${error.message}`);
    }
  }

  return createdCount;
};
