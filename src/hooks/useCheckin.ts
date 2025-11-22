import { useState, useEffect } from 'react';
import { getActiveCheckin, CheckinWithLotInfo } from '../services/checkinService';

/**
 * Hook to manage active check-in state
 */
export function useCheckin(userId: string | null | undefined) {
  const [activeCheckin, setActiveCheckin] = useState<CheckinWithLotInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setActiveCheckin(null);
      setLoading(false);
      return;
    }

    async function fetchActiveCheckin() {
      try {
        setLoading(true);
        setError(null);
        const checkin = await getActiveCheckin(userId);
        setActiveCheckin(checkin);
      } catch (err) {
        console.error('Error fetching active check-in:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchActiveCheckin();
  }, [userId]);

  return { activeCheckin, loading, error, refresh: () => {
    if (userId) {
      getActiveCheckin(userId).then(setActiveCheckin);
    }
  }};
}
