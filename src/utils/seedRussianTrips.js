import { base44 } from '../api/base44Client';

export const seedRussianTrips = async (onStatusUpdate) => {
  const today = new Date();
  const twoMonthsFromNow = new Date(today);
  twoMonthsFromNow.setDate(today.getDate() + 60); // Start in roughly 2 months

  const trips = [
    // --- Advanced Treks (Multi-day) ---
    {
      title: "Алтай - Сердце Сибири",
      description: "Увлекательное путешествие к подножию горы Белуха. Кристально чистые озера, бурные реки и величественные горы Алтая. Этот маршрут для тех, кто ищет единения с дикой природой.",
      location: "Тюнгур, Республика Алтай",
      country: "russia",
      region: "Siberia",
      latitude: 50.1500,
      longitude: 86.6667,
      duration_type: 'multi_day',
      duration_value: 7,
      activity_type: 'trek',
      difficulty: 'hard',
      trip_character: ['nature', 'mountains', 'challenge'],
      trail_type: ['marked'],
      trek_days: Array(7).fill({
        start_point: "Лагерь",
        end_point: "Лагерь",
        distance_km: 15,
        elevation_gain_m: 600,
        difficulty: "hard"
      }),
      image_url: "https://images.unsplash.com/photo-1548233306-c32607908b89?auto=format&fit=crop&q=80&w=1000", // Altai similar
      max_participants: 12,
      start_delay_days: 0 // Starts exactly in 2 months
    },
    {
      title: "Байкал - Великое Озеро",
      description: "Поход по Большой Байкальской Тропе. Уникальные пейзажи самого глубокого озера планеты, тайга и чистейший воздух. Незабываемые впечатления гарантированы.",
      location: "Листвянка, Иркутская область",
      country: "russia",
      region: "Siberia",
      latitude: 51.8496,
      longitude: 104.8643,
      duration_type: 'multi_day',
      duration_value: 5,
      activity_type: 'trek',
      difficulty: 'moderate',
      trip_character: ['nature', 'water', 'forest'],
      trail_type: ['marked'],
      trek_days: Array(5).fill({
        start_point: "Турбаза",
        end_point: "Турбаза",
        distance_km: 12,
        elevation_gain_m: 300,
        difficulty: "moderate"
      }),
      image_url: "https://images.unsplash.com/photo-1551845856-c38703875297?auto=format&fit=crop&q=80&w=1000", // Lake Baikal
      max_participants: 15,
      start_delay_days: 3
    },
    // --- City/Cultural (Day Trips) ---
    {
      title: "Золотое Кольцо - Суздаль",
      description: "Однодневная экскурсия по древнему Суздалю. Кремль, монастыри и деревянное зодчество. Погружение в историю Руси.",
      location: "Суздаль, Владимирская область",
      country: "russia",
      region: "Central Russia",
      latitude: 56.4191,
      longitude: 40.4489,
      duration_type: 'full_day',
      duration_value: 1,
      activity_type: 'hiking',
      difficulty: 'easy',
      trip_character: ['culture', 'history', 'architecture'],
      trail_type: ['paved'],
      image_url: "https://images.unsplash.com/photo-1596423521360-19277d32371c?auto=format&fit=crop&q=80&w=1000", // Suzdal/Russian church
      max_participants: 20,
      start_delay_days: 5
    },
    {
      title: "Камчатка - Страна Вулканов",
      description: "Экспедиция к действующим вулканам Камчатки. Гейзеры, термальные источники и возможность увидеть медведей в естественной среде обитания.",
      location: "Петропавловск-Камчатский",
      country: "russia",
      region: "Far East",
      latitude: 53.0167,
      longitude: 158.6500,
      duration_type: 'multi_day',
      duration_value: 10,
      activity_type: 'trek',
      difficulty: 'extreme',
      trip_character: ['volcano', 'wildlife', 'extreme'],
      trail_type: ['technical'],
      trek_days: Array(10).fill({
        start_point: "Лагерь",
        end_point: "Лагерь",
        distance_km: 10,
        elevation_gain_m: 1000,
        difficulty: "very_hard"
      }),
      image_url: "https://images.unsplash.com/photo-1547494483-e8d070b7410f?auto=format&fit=crop&q=80&w=1000", // Kamchatka/Volcano
      max_participants: 8,
      start_delay_days: 10
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
        meeting_time: "08:00",
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
