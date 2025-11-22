import { supabase } from '../../supabase';
import { Profile, ProfileInsert } from '../types/database';

/**
 * Get user profile
 */
export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    console.error('Error fetching profile:', error);
    throw error;
  }

  return data;
}

/**
 * Create a new profile
 */
export async function createProfile(userId: string, permitType: string = 'S'): Promise<Profile> {
  const profileData: ProfileInsert = {
    id: userId,
    permit_type: permitType,
    checkin_count: 0,
  };

  const { data, error } = await supabase
    .from('profiles')
    .insert(profileData)
    .select()
    .single();

  if (error) {
    console.error('Error creating profile:', error);
    throw error;
  }

  return data;
}

/**
 * Update user profile
 */
export async function updateProfile(
  userId: string,
  updates: { permit_type?: string; current_lot_id?: string | null }
): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating profile:', error);
    throw error;
  }

  return data;
}

/**
 * Get or create profile
 */
export async function getOrCreateProfile(
  userId: string,
  permitType: string = 'S'
): Promise<Profile> {
  const profile = await getProfile(userId);

  if (profile) {
    return profile;
  }

  return createProfile(userId, permitType);
}
