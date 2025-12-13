// Country to regions mapping
export const countryRegions = {
  israel: {
    regions: ['north', 'center', 'south', 'jerusalem', 'negev', 'eilat'],
    default_center: [31.5, 34.75]
  },
  usa: {
    regions: ['northeast', 'southeast', 'midwest', 'southwest', 'west', 'pacific_northwest', 'rocky_mountains', 'great_plains'],
    default_center: [39.8283, -98.5795]
  },
  italy: {
    regions: ['northern', 'central', 'southern', 'sicily', 'sardinia', 'tuscany', 'lombardy', 'veneto'],
    default_center: [41.8719, 12.5674]
  },
  spain: {
    regions: ['andalusia', 'catalonia', 'madrid', 'valencia', 'basque_country', 'galicia', 'canary_islands', 'balearic_islands'],
    default_center: [40.4637, -3.7492]
  },
  france: {
    regions: ['ile_de_france', 'provence', 'brittany', 'normandy', 'alps', 'pyrenees', 'corsica', 'burgundy'],
    default_center: [46.2276, 2.2137]
  },
  germany: {
    regions: ['bavaria', 'berlin', 'baden_wurttemberg', 'north_rhine_westphalia', 'saxony', 'hesse', 'rhineland_palatinate', 'lower_saxony'],
    default_center: [51.1657, 10.4515]
  },
  uk: {
    regions: ['england_south', 'england_north', 'scotland', 'wales', 'northern_ireland', 'london', 'lake_district', 'peak_district'],
    default_center: [55.3781, -3.4360]
  },
  japan: {
    regions: ['hokkaido', 'tohoku', 'kanto', 'chubu', 'kansai', 'chugoku', 'shikoku', 'kyushu'],
    default_center: [36.2048, 138.2529]
  },
  australia: {
    regions: ['new_south_wales', 'victoria', 'queensland', 'western_australia', 'south_australia', 'tasmania', 'northern_territory'],
    default_center: [-25.2744, 133.7751]
  },
  canada: {
    regions: ['british_columbia', 'alberta', 'ontario', 'quebec', 'maritime_provinces', 'yukon', 'northwest_territories', 'nunavut'],
    default_center: [56.1304, -106.3468]
  },
  switzerland: {
    regions: ['valais', 'graubunden', 'bern', 'zurich', 'ticino', 'central_switzerland', 'eastern_switzerland', 'western_switzerland'],
    default_center: [46.8182, 8.2275]
  },
  austria: {
    regions: ['tyrol', 'salzburg', 'vienna', 'upper_austria', 'lower_austria', 'styria', 'carinthia', 'vorarlberg'],
    default_center: [47.5162, 14.5501]
  },
  new_zealand: {
    regions: ['north_island', 'south_island', 'auckland', 'canterbury', 'otago', 'wellington', 'marlborough', 'west_coast'],
    default_center: [-40.9006, 174.8860]
  },
  norway: {
    regions: ['eastern', 'western', 'southern', 'central', 'northern', 'lofoten', 'fjord_norway', 'nordland'],
    default_center: [60.4720, 8.4689]
  },
  sweden: {
    regions: ['stockholm', 'goteborg', 'malmo', 'norrland', 'svealand', 'gotaland', 'lapland', 'dalarna'],
    default_center: [60.1282, 18.6435]
  }
};

export const getCountryRegions = (countryId) => {
  return countryRegions[countryId]?.regions || [];
};

export const getCountryCenter = (countryId) => {
  return countryRegions[countryId]?.default_center || [31.5, 34.75];
};

export const getAllCountries = () => {
  return Object.keys(countryRegions);
};