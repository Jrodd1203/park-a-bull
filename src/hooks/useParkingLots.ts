import { useState, useEffect } from 'react';
import { getAllParkingLots, getParkingLotsByPermit, subscribeToParkingLots, ParkingLotWithAvailability } from '../services/parkingService';

/**
 * Hook to fetch and subscribe to parking lots
 */
export function useParkingLots(permitFilter?: string) {
  const [lots, setLots] = useState<ParkingLotWithAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    async function fetchLots() {
      try {
        setLoading(true);
        setError(null);

        const data = permitFilter
          ? await getParkingLotsByPermit(permitFilter)
          : await getAllParkingLots();

        setLots(data);

        // Subscribe to real-time updates
        unsubscribe = subscribeToParkingLots((updatedLots) => {
          const filteredLots = permitFilter
            ? updatedLots.filter(lot => lot.permits.includes(permitFilter))
            : updatedLots;
          setLots(filteredLots);
        });
      } catch (err) {
        console.error('Error fetching parking lots:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchLots();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [permitFilter]);

  return { lots, loading, error };
}
