// src/utils/buildingLocations.ts

/**
 * USF Campus Buildings
 * For destination search functionality
 */

export interface Building {
  id: string;
  name: string;
  abbreviation: string;
  aliases: string[];
  coordinates: {
    latitude: number;
    longitude: number;
  };
  category: 'academic' | 'housing' | 'dining' | 'recreation' | 'administrative' | 'other';
  description?: string;
}

export const USF_BUILDINGS: Building[] = [
  {
    id: 'library',
    name: 'USF Library',
    abbreviation: 'LIB',
    aliases: ['Library', 'Tampa Library', 'Main Library'],
    coordinates: {
      latitude: 28.0575,
      longitude: -82.4145,
    },
    category: 'academic',
    description: 'Main campus library with study spaces',
  },
  {
    id: 'msc',
    name: 'Marshall Student Center',
    abbreviation: 'MSC',
    aliases: ['Marshall Center', 'Student Center', 'MSC', 'Marshall'],
    coordinates: {
      latitude: 28.0651,
      longitude: -82.4181,
    },
    category: 'other',
    description: 'Student union with dining and meeting spaces',
  },
  {
    id: 'rec-center',
    name: 'Campus Recreation Center',
    abbreviation: 'REC',
    aliases: ['Rec Center', 'Recreation Center', 'Gym', 'Fitness Center', 'REC'],
    coordinates: {
      latitude: 28.0625,
      longitude: -82.4155,
    },
    category: 'recreation',
    description: 'Fitness and recreation facility',
  },
  {
    id: 'bsf',
    name: 'Business Building',
    abbreviation: 'BSF',
    aliases: ['BSF', 'Business', 'Muma College of Business', 'Muma'],
    coordinates: {
      latitude: 28.0595,
      longitude: -82.4170,
    },
    category: 'academic',
    description: 'Muma College of Business',
  },
  {
    id: 'eng',
    name: 'Engineering Building',
    abbreviation: 'ENG',
    aliases: ['ENG', 'Engineering', 'College of Engineering'],
    coordinates: {
      latitude: 28.0605,
      longitude: -82.4125,
    },
    category: 'academic',
    description: 'College of Engineering',
  },
  {
    id: 'cooper-hall',
    name: 'Cooper Hall',
    abbreviation: 'CPR',
    aliases: ['Cooper', 'CPR', 'Cooper Hall'],
    coordinates: {
      latitude: 28.0640,
      longitude: -82.4195,
    },
    category: 'academic',
    description: 'Academic building',
  },
  {
    id: 'edu',
    name: 'College of Education',
    abbreviation: 'EDU',
    aliases: ['Education', 'EDU', 'College of Education'],
    coordinates: {
      latitude: 28.0560,
      longitude: -82.4190,
    },
    category: 'academic',
    description: 'College of Education',
  },
  {
    id: 'sun-dome',
    name: 'Yuengling Center',
    abbreviation: 'DOME',
    aliases: ['Sun Dome', 'Yuengling Center', 'Arena', 'DOME'],
    coordinates: {
      latitude: 28.0630,
      longitude: -82.4095,
    },
    category: 'recreation',
    description: 'Sports and events arena',
  },
  {
    id: 'dining-hall',
    name: 'Fresh Food Company',
    abbreviation: 'FFC',
    aliases: ['Fresh Food', 'Dining Hall', 'FFC', 'Cafeteria'],
    coordinates: {
      latitude: 28.0590,
      longitude: -82.4150,
    },
    category: 'dining',
    description: 'Main dining facility',
  },
  {
    id: 'juniper-poplar',
    name: 'Juniper-Poplar Hall',
    abbreviation: 'JP',
    aliases: ['JP', 'Juniper', 'Poplar', 'Juniper-Poplar'],
    coordinates: {
      latitude: 28.0570,
      longitude: -82.4120,
    },
    category: 'housing',
    description: 'Student residence hall',
  },
  {
    id: 'health-sciences',
    name: 'USF Health',
    abbreviation: 'MDC',
    aliases: ['Health Sciences', 'Medical', 'USF Health', 'MDC'],
    coordinates: {
      latitude: 28.0520,
      longitude: -82.4160,
    },
    category: 'academic',
    description: 'Health sciences campus',
  },
  {
    id: 'bookstore',
    name: 'Barnes & Noble Bookstore',
    abbreviation: 'BKS',
    aliases: ['Bookstore', 'Barnes and Noble', 'BKS'],
    coordinates: {
      latitude: 28.0655,
      longitude: -82.4175,
    },
    category: 'other',
    description: 'Campus bookstore',
  },
];

/**
 * Get building by ID
 */
export function getBuildingById(id: string): Building | undefined {
  return USF_BUILDINGS.find(building => building.id === id);
}

/**
 * Search buildings by name or alias (case-insensitive)
 */
export function searchBuildings(query: string): Building[] {
  const lowerQuery = query.toLowerCase().trim();
  
  if (!lowerQuery) return [];
  
  return USF_BUILDINGS.filter(building => {
    // Check name
    if (building.name.toLowerCase().includes(lowerQuery)) return true;
    
    // Check abbreviation
    if (building.abbreviation.toLowerCase().includes(lowerQuery)) return true;
    
    // Check aliases
    if (building.aliases.some(alias => alias.toLowerCase().includes(lowerQuery))) return true;
    
    return false;
  });
}

/**
 * Get buildings by category
 */
export function getBuildingsByCategory(category: Building['category']): Building[] {
  return USF_BUILDINGS.filter(building => building.category === category);
}

/**
 * Get popular destinations (for quick access)
 */
export function getPopularDestinations(): Building[] {
  const popularIds = ['library', 'msc', 'rec-center', 'bsf'];
  return USF_BUILDINGS.filter(building => popularIds.includes(building.id));
}