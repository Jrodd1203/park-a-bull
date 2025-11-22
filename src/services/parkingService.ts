import { supabase } from '../../supabase';
import { ParkingLot } from '../types/database';

export interface ParkingLotWithAvailability extends ParkingLot {
  availableSpots: number;
  occupancyPercentage: number;
  status: 'available' | 'limited' | 'full';
}

/**
 * Get all parking lots
 */
export async function getAllParkingLots(): Promise<ParkingLotWithAvailability[]> {
  const { data, error } = await supabase
    .from('parking_lots')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching parking lots:', error);
    throw error;
  }

  return data.map(enrichParkingLot);
}

/**
 * Get parking lots by permit type
 */
export async function getParkingLotsByPermit(permitType: string): Promise<ParkingLotWithAvailability[]> {
  const { data, error } = await supabase
    .from('parking_lots')
    .select('*')
    .contains('permits', [permitType])
    .order('name');

  if (error) {
    console.error('Error fetching parking lots by permit:', error);
    throw error;
  }

  return data.map(enrichParkingLot);
}

/**
 * Get a single parking lot by ID
 */
export async function getParkingLotById(id: string): Promise<ParkingLotWithAvailability | null> {
  const { data, error } = await supabase
    .from('parking_lots')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching parking lot:', error);
    throw error;
  }

  return data ? enrichParkingLot(data) : null;
}

/**
 * Get parking lots near a location
 */
export async function getParkingLotsNearLocation(
  latitude: number,
  longitude: number,
  radiusMeters: number = 2000
): Promise<ParkingLotWithAvailability[]> {
  // Note: This is a simple distance calculation
  // For production, consider using PostGIS extension for better geospatial queries
  const { data, error } = await supabase
    .from('parking_lots')
    .select('*');

  if (error) {
    console.error('Error fetching parking lots:', error);
    throw error;
  }

  // Filter by distance (Haversine formula)
  const lotsWithDistance = data.map(lot => ({
    ...lot,
    distance: calculateDistance(latitude, longitude, lot.latitude, lot.longitude),
  }));

  const nearbyLots = lotsWithDistance
    .filter(lot => lot.distance <= radiusMeters)
    .sort((a, b) => a.distance - b.distance);

  return nearbyLots.map(enrichParkingLot);
}

/**
 * Subscribe to real-time parking lot updates
 */
export function subscribeToParkingLots(
  callback: (lots: ParkingLotWithAvailability[]) => void
) {
  const subscription = supabase
    .channel('parking_lots_changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'parking_lots' },
      async () => {
        // Fetch updated data when changes occur
        const lots = await getAllParkingLots();
        callback(lots);
      }
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}

/**
 * Calculate distance between two coordinates using Haversine formula
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

/**
 * Enrich parking lot data with calculated fields
 */
function enrichParkingLot(lot: ParkingLot): ParkingLotWithAvailability {
  const availableSpots = lot.capacity - lot.current_occupancy;
  const occupancyPercentage = (lot.current_occupancy / lot.capacity) * 100;

  let status: 'available' | 'limited' | 'full';
  if (occupancyPercentage < 60) {
    status = 'available';
  } else if (occupancyPercentage < 85) {
    status = 'limited';
  } else {
    status = 'full';
  }

  return {
    ...lot,
    availableSpots,
    occupancyPercentage,
    status,
  };
}
