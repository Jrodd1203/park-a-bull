// constants/parkingLocations.ts

/**
 * USF Parking Lots and Garages
 * Coordinates are real USF locations
 */

export interface ParkingLocation {
  id: string;
  name: string;
  shortName: string;
  type: 'garage' | 'lot';
  permits: string[];
  capacity: Record<string, number>;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  features: string[];
  floors?: number;
  address?: string;
  notes?: string;
}

export const USF_PARKING_LOTS: ParkingLocation[] = [
  {
    id: 'crescent-hill',
    name: 'Crescent Hill Parking Garage',
    shortName: 'Crescent Hill',
    type: 'garage',
    permits: ['S', 'R', 'E'],
    capacity: {
      S: 200,
      R: 50,
      E: 100,
    },
    coordinates: {
      latitude: 28.0583,
      longitude: -82.4139,
    },
    features: ['covered', 'ev-charging', 'security-cameras', '24-7-access'],
    floors: 4,
    address: 'Crescent Hill Dr, Tampa, FL 33620',
    notes: 'Closest to residence halls and dining',
  },
  {
    id: 'elm-drive',
    name: 'Elm Drive Parking Garage',
    shortName: 'Elm Drive',
    type: 'garage',
    permits: ['S', 'R'],
    capacity: {
      S: 150,
      R: 80,
    },
    coordinates: {
      latitude: 28.0595,
      longitude: -82.4125,
    },
    features: ['covered', 'well-lit', 'security-cameras'],
    floors: 3,
    address: 'Elm Dr, Tampa, FL 33620',
    notes: 'Near College of Engineering',
  },
  {
    id: 'beard-garage',
    name: 'Beard Parking Garage',
    shortName: 'Beard',
    type: 'garage',
    permits: ['E'],
    capacity: {
      E: 300,
    },
    coordinates: {
      latitude: 28.0575,
      longitude: -82.4155,
    },
    features: ['covered', 'ev-charging', 'reserved-spots'],
    floors: 5,
    address: 'Beard Dr, Tampa, FL 33620',
    notes: 'Faculty and staff only',
  },
  {
    id: 'alumni-center',
    name: 'Alumni Center Parking',
    shortName: 'Alumni Center',
    type: 'lot',
    permits: ['S', 'E'],
    capacity: {
      S: 100,
      E: 50,
    },
    coordinates: {
      latitude: 28.0610,
      longitude: -82.4170,
    },
    features: ['outdoor', 'well-lit'],
    address: 'Alumni Dr, Tampa, FL 33620',
    notes: 'Near Marshall Student Center',
  },
  {
    id: 'laurel-drive',
    name: 'Laurel Drive Parking',
    shortName: 'Laurel Drive',
    type: 'lot',
    permits: ['S'],
    capacity: {
      S: 120,
    },
    coordinates: {
      latitude: 28.0565,
      longitude: -82.4105,
    },
    features: ['outdoor', 'shuttle-access'],
    address: 'Laurel Dr, Tampa, FL 33620',
    notes: 'Shuttle service available during peak hours',
  },
  {
    id: 'magnolia-drive',
    name: 'Magnolia Drive Parking',
    shortName: 'Magnolia',
    type: 'lot',
    permits: ['S', 'R'],
    capacity: {
      S: 90,
      R: 40,
    },
    coordinates: {
      latitude: 28.0620,
      longitude: -82.4145,
    },
    features: ['outdoor', 'close-to-gym'],
    address: 'Magnolia Dr, Tampa, FL 33620',
    notes: 'Near Recreation Center',
  },
  {
    id: 'visitor-lot-a',
    name: 'Visitor Parking Lot A',
    shortName: 'Visitor A',
    type: 'lot',
    permits: ['V'],
    capacity: {
      V: 60,
    },
    coordinates: {
      latitude: 28.0600,
      longitude: -82.4180,
    },
    features: ['outdoor', 'pay-station', 'short-term'],
    address: 'USF Main Entrance, Tampa, FL 33620',
    notes: 'Hourly parking available. Pay at kiosk.',
  },
  {
    id: 'palm-drive',
    name: 'Palm Drive Parking',
    shortName: 'Palm Drive',
    type: 'lot',
    permits: ['S', 'E'],
    capacity: {
      S: 110,
      E: 45,
    },
    coordinates: {
      latitude: 28.0555,
      longitude: -82.4160,
    },
    features: ['outdoor', 'well-lit', 'security-patrol'],
    address: 'Palm Dr, Tampa, FL 33620',
    notes: 'Near Library',
  },
  {
    id: 'cypress-garage',
    name: 'Cypress Parking Garage',
    shortName: 'Cypress',
    type: 'garage',
    permits: ['S', 'R', 'E'],
    capacity: {
      S: 180,
      R: 60,
      E: 80,
    },
    coordinates: {
      latitude: 28.0545,
      longitude: -82.4130,
    },
    features: ['covered', 'ev-charging', '24-7-access', 'bike-racks'],
    floors: 4,
    address: 'Cypress Dr, Tampa, FL 33620',
    notes: 'Central campus location',
  },
  {
    id: 'holly-drive',
    name: 'Holly Drive Parking',
    shortName: 'Holly',
    type: 'lot',
    permits: ['S'],
    capacity: {
      S: 85,
    },
    coordinates: {
      latitude: 28.0635,
      longitude: -82.4115,
    },
    features: ['outdoor', 'shuttle-access'],
    address: 'Holly Dr, Tampa, FL 33620',
    notes: 'Overflow parking with shuttle',
  },
];

/**
 * Get parking lot by ID
 */
export function getParkingLotById(id: string): ParkingLocation | undefined {
  return USF_PARKING_LOTS.find(lot => lot.id === id);
}

/**
 * Get parking lots by permit type
 */
export function getParkingLotsByPermit(permitType: string): ParkingLocation[] {
  return USF_PARKING_LOTS.filter(lot => lot.permits.includes(permitType));
}

/**
 * Get parking lots by type (garage or lot)
 */
export function getParkingLotsByType(type: 'garage' | 'lot'): ParkingLocation[] {
  return USF_PARKING_LOTS.filter(lot => lot.type === type);
}

/**
 * Get all garages
 */
export function getAllGarages(): ParkingLocation[] {
  return getParkingLotsByType('garage');
}

/**
 * Get all surface lots
 */
export function getAllSurfaceLots(): ParkingLocation[] {
  return getParkingLotsByType('lot');
}