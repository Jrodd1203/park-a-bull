import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { getCurrentUser, subscribeToAuthChanges } from '../services/authService';
import { Profile } from '../types/database';
import { getProfile } from '../services/profileService';

/**
 * Hook to manage authentication state
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial user
    async function initAuth() {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);

        if (currentUser) {
          const userProfile = await getProfile(currentUser.id);
          setProfile(userProfile);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    }

    initAuth();

    // Subscribe to auth changes
    const unsubscribe = subscribeToAuthChanges(async (event, session) => {
      setUser(session?.user ?? null);

      if (session?.user) {
        const userProfile = await getProfile(session.user.id);
        setProfile(userProfile);
      } else {
        setProfile(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return { user, profile, loading };
}
