import { supabase } from '../../supabase';
import { Checkin, CheckinInsert } from '../types/database';

export interface CheckinWithLotInfo extends Checkin {
  lot_name?: string;
  lot_type?: 'garage' | 'lot';
}

/**
 * Create a new check-in
 */
export async function createCheckin(
  userId: string,
  lotId: string,
  permitType: string,
  floor?: number,
  spotNumber?: string
): Promise<Checkin> {
  console.log('[checkinService] createCheckin called with:', {
    userId,
    lotId,
    permitType,
    floor,
    spotNumber,
  });

  const checkinData: CheckinInsert = {
    user_id: userId,
    lot_id: lotId,
    permit_type: permitType,
    floor,
    spot_number: spotNumber,
    status: 'active',
  };

  console.log('[checkinService] Prepared checkin data:', checkinData);

  const { data, error } = await supabase
    .from('checkins')
    .insert(checkinData)
    .select()
    .single();

  console.log('[checkinService] Supabase response:', { data, error });

  if (error) {
    console.error('[checkinService] Error creating check-in:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    throw error;
  }

  console.log('[checkinService] Check-in created successfully:', data);
  return data;
}

/**
 * Check out (mark check-in as departed)
 */
export async function checkOut(checkinId: string): Promise<Checkin> {
  const { data, error } = await supabase
    .from('checkins')
    .update({
      status: 'departed',
      checked_out_at: new Date().toISOString(),
    })
    .eq('id', checkinId)
    .select()
    .single();

  if (error) {
    console.error('Error checking out:', error);
    throw error;
  }

  return data;
}

/**
 * Get active check-in for a user
 */
export async function getActiveCheckin(userId: string): Promise<CheckinWithLotInfo | null> {
  const { data, error } = await supabase
    .from('checkins')
    .select(`
      *,
      parking_lots (
        name,
        type
      )
    `)
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('checked_in_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    console.error('Error fetching active check-in:', error);
    throw error;
  }

  if (!data) {
    return null;
  }

  // Type assertion for parking_lots data
  const lotInfo = data.parking_lots as any;

  return {
    ...data,
    lot_name: lotInfo?.name,
    lot_type: lotInfo?.type,
  };
}

/**
 * Get user's check-in history
 */
export async function getUserCheckins(
  userId: string,
  limit: number = 10
): Promise<CheckinWithLotInfo[]> {
  const { data, error } = await supabase
    .from('checkins')
    .select(`
      *,
      parking_lots (
        name,
        type
      )
    `)
    .eq('user_id', userId)
    .order('checked_in_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching check-in history:', error);
    throw error;
  }

  return data.map(checkin => {
    const lotInfo = checkin.parking_lots as any;
    return {
      ...checkin,
      lot_name: lotInfo?.name,
      lot_type: lotInfo?.type,
    };
  });
}

/**
 * Get weekly check-in count for a user
 */
export async function getWeeklyCheckinCount(userId: string): Promise<number> {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const { data, error } = await supabase
    .from('checkins')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('checked_in_at', oneWeekAgo.toISOString());

  if (error) {
    console.error('Error fetching weekly check-in count:', error);
    throw error;
  }

  return data || 0;
}

/**
 * Subscribe to check-in updates for a user
 */
export function subscribeToUserCheckins(
  userId: string,
  callback: (checkin: Checkin) => void
) {
  const subscription = supabase
    .channel(`checkins_${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'checkins',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        callback(payload.new as Checkin);
      }
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}
