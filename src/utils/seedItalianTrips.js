import { base44 } from '../api/base44Client';

export const seedItalianTrips = async (onStatusUpdate) => {
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7); // Start from next week

  const trips = [
    // --- Advanced Treks (Multi-day) ---
    {
      title: "Alta Via 1 - Leggende delle Dolomiti",
      description: "Un trekking leggendario attraverso il cuore delle Dolomiti. Paesaggi mozzafiato, rifugi accoglienti e vette maestose. Questo percorso iconico vi porterà dal Lago di Braies a Belluno, attraversando alcuni dei paesaggi più spettacolari delle Alpi.",
      location: "Lago di Braies, Bolzano",
      country: "italy",
      region: "Trentino-Alto Adige",
      latitude: 46.6943,
      longitude: 12.0854,
      duration_type: 'multi_day',
      duration_value: 6,
      activity_type: 'trek',
      difficulty: 'hard',
      trip_character: ['nature', 'mountains', 'challenge'],
      trail_type: ['marked'],
      trek_days: Array(6).fill({
        start_point: "Rifugio",
        end_point: "Rifugio",
        distance_km: 15,
        elevation_gain_m: 800,
        difficulty: "hard"
      }),
      image_url: "https://images.unsplash.com/photo-1519922661266-3974df2f9d15?auto=format&fit=crop&q=80&w=1000", // Dolomites
      max_participants: 12,
      start_delay_days: 0 // Starts exactly next week
    },
    {
      title: "Selvaggio Blu - L'Avventura Estrema",
      description: "Il trekking più selvaggio d'Italia. Scogliere a picco sul mare, calette nascoste e passaggi tecnici nel Golfo di Orosei. Un'esperienza unica per escursionisti esperti che cercano una vera sfida in un ambiente incontaminato.",
      location: "Santa Maria Navarrese, Nuoro",
      country: "italy",
      region: "Sardegna",
      latitude: 40.0000,
      longitude: 9.6833,
      duration_type: 'multi_day',
      duration_value: 5,
      activity_type: 'trek',
      difficulty: 'hard',
      trip_character: ['sea', 'extreme', 'nature'],
      trail_type: ['technical'],
      trek_days: Array(5).fill({
        start_point: "Cala",
        end_point: "Cala",
        distance_km: 10,
        elevation_gain_m: 600,
        difficulty: "very_hard"
      }),
      image_url: "https://images.unsplash.com/photo-1534008897995-27a23e859048?auto=format&fit=crop&q=80&w=1000", // Sardinia coast
      max_participants: 8,
      start_delay_days: 2 // Starts 2 days after next week
    },
    {
      title: "GTA - Sentieri del Piemonte",
      description: "Un viaggio nella cultura alpina autentica. Antiche mulattiere, villaggi in pietra e la quiete delle Alpi Occidentali. Scoprite la Grande Traversata delle Alpi in questo segmento mozzafiato.",
      location: "Limone Piemonte, Cuneo",
      country: "italy",
      region: "Piemonte",
      latitude: 44.2000,
      longitude: 7.5667,
      duration_type: 'multi_day',
      duration_value: 4,
      activity_type: 'trek',
      difficulty: 'hard',
      trip_character: ['culture', 'mountains', 'history'],
      trail_type: ['marked'],
      trek_days: Array(4).fill({
        start_point: "Borgata",
        end_point: "Borgata",
        distance_km: 18,
        elevation_gain_m: 1000,
        difficulty: "hard"
      }),
      image_url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1000", // Alps
      max_participants: 10,
      start_delay_days: 4
    },

    // --- Families (Day Trips) ---
    {
      title: "Cinque Terre - Sentiero Azzurro",
      description: "Una passeggiata indimenticabile tra i borghi colorati a picco sul mare. Adatto a famiglie, con viste spettacolari. Percorreremo il tratto più accessibile godendo dei profumi della macchia mediterranea.",
      location: "Monterosso al Mare, La Spezia",
      country: "italy",
      region: "Liguria",
      latitude: 44.1448,
      longitude: 9.6544,
      duration_type: 'full_day',
      duration_value: 1,
      activity_type: 'hiking',
      difficulty: 'moderate', // Some stairs, but safe
      trip_character: ['sea', 'villages', 'family'],
      trail_type: ['marked', 'paved'],
      itinerary: [
        { time: "09:00", description: "Incontro a Monterosso", location: "Stazione" },
        { time: "10:00", description: "Camminata panoramica", location: "Sentiero" },
        { time: "13:00", description: "Pranzo al sacco o focaccia", location: "Vernazza" }
      ],
      image_url: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&q=80&w=1000", // Cinque Terre
      max_participants: 20,
      start_delay_days: 1
    },
    {
      title: "Valle delle Ferriere - Oasi Verde",
      description: "Un percorso facile e rinfrescante tra cascate, felci preistoriche e antiche cartiere, a due passi da Amalfi. Ideale per famiglie che cercano un po' di fresco e natura rigogliosa.",
      location: "Pontone, Salerno",
      country: "italy",
      region: "Campania",
      latitude: 40.6439,
      longitude: 14.6025,
      duration_type: 'full_day', // Treated as full day or half day
      duration_value: 0.5, // 4 hours
      activity_type: 'hiking',
      difficulty: 'easy',
      trip_character: ['nature', 'water', 'family'],
      trail_type: ['marked', 'forest'],
      itinerary: [
        { time: "09:30", description: "Partenza da Pontone", location: "Piazza" },
        { time: "11:00", description: "Arrivo alle cascate", location: "Riserva" },
        { time: "12:30", description: "Discesa verso Amalfi", location: "Amalfi" }
      ],
      image_url: "https://images.unsplash.com/photo-1634914757367-1582e0436fdf?auto=format&fit=crop&q=80&w=1000", // Amalfi/Greenery
      max_participants: 25,
      start_delay_days: 3
    },
    {
      title: "Giro delle Tre Cime di Lavaredo",
      description: "L'icona delle Dolomiti. Un anello panoramico accessibile che offre viste impareggiabili sulle tre cime famose in tutto il mondo. Un'esperienza alpina sicura e gratificante per tutta la famiglia.",
      location: "Rifugio Auronzo, Belluno",
      country: "italy",
      region: "Veneto",
      latitude: 46.6124,
      longitude: 12.2954,
      duration_type: 'full_day',
      duration_value: 1,
      activity_type: 'hiking',
      difficulty: 'moderate', // Flat but high altitude
      trip_character: ['mountains', 'views', 'family'],
      trail_type: ['gravel'],
      itinerary: [
        { time: "08:30", description: "Arrivo al Rifugio Auronzo", location: "Parcheggio" },
        { time: "10:00", description: "Rifugio Lavaredo", location: "Sentiero 101" },
        { time: "12:00", description: "Forcella Lavaredo (vista classica)", location: "Forcella" }
      ],
      image_url: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=1000", // Tre Cime
      max_participants: 30,
      start_delay_days: 5
    }
  ];

  let successCount = 0;
  
  for (const trip of trips) {
    try {
      if (onStatusUpdate) onStatusUpdate(`Creating: ${trip.title}...`);
      
      const tripDate = new Date(nextWeek);
      tripDate.setDate(nextWeek.getDate() + trip.start_delay_days);
      
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
          currency: 'ILS',
          base_registration_fee: 0,
          payment_methods: [],
        },
        budget: {
          solo_min: null,
          solo_max: null,
          family_min: null,
          family_max: null,
          currency: 'ILS',
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
