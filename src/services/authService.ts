import { supabase } from '../../supabase';
import { Session, User } from '@supabase/supabase-js';
import { getOrCreateProfile } from './profileService';

export interface AuthResponse {
  user: User | null;
  session: Session | null;
  error: Error | null;
}

/**
 * Sign up with email and password
 */
export async function signUp(
  email: string,
  password: string,
  permitType: string = 'S'
): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return { user: null, session: null, error };
    }

    // Create profile after successful sign-up
    if (data.user) {
      await getOrCreateProfile(data.user.id, permitType);
    }

    return { user: data.user, session: data.session, error: null };
  } catch (error) {
    console.error('Error during sign up:', error);
    return { user: null, session: null, error: error as Error };
  }
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { user: null, session: null, error };
    }

    // Ensure profile exists
    if (data.user) {
      await getOrCreateProfile(data.user.id);
    }

    return { user: data.user, session: data.session, error: null };
  } catch (error) {
    console.error('Error during sign in:', error);
    return { user: null, session: null, error: error as Error };
  }
}

/**
 * Sign in anonymously (for demo/testing)
 */
export async function signInAnonymously(): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signInAnonymously();

    if (error) {
      return { user: null, session: null, error };
    }

    // Create profile for anonymous user
    if (data.user) {
      await getOrCreateProfile(data.user.id);
    }

    return { user: data.user, session: data.session, error: null };
  } catch (error) {
    console.error('Error during anonymous sign in:', error);
    return { user: null, session: null, error: error as Error };
  }
}

/**
 * Sign out
 */
export async function signOut(): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (error) {
    console.error('Error during sign out:', error);
    return { error: error as Error };
  }
}

/**
 * Get current session
 */
export async function getCurrentSession(): Promise<Session | null> {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error('Error getting session:', error);
    return null;
  }

  return data.session;
}

/**
 * Get current user
 */
export async function getCurrentUser(): Promise<User | null> {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error('Error getting user:', error);
    return null;
  }

  return data.user;
}

/**
 * Subscribe to auth state changes
 */
export function subscribeToAuthChanges(
  callback: (event: string, session: Session | null) => void
) {
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });

  return data.subscription.unsubscribe;
}

/**
 * Reset password
 */
export async function resetPassword(email: string): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return { error };
  } catch (error) {
    console.error('Error resetting password:', error);
    return { error: error as Error };
  }
}

/**
 * Update password
 */
export async function updatePassword(newPassword: string): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    return { error };
  } catch (error) {
    console.error('Error updating password:', error);
    return { error: error as Error };
  }
}
