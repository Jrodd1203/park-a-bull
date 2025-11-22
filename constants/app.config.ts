// src/config/app.config.ts

/**
 * Application Configuration
 * Central place for app-wide settings
 */

export const APP_CONFIG = {
  // App Info
  name: 'parkabull',
  displayName: 'parkabull',
  tagline: 'Find your spot',
  version: '1.0.0',
  
  // API Configuration
  api: {
    supabase: {
      url: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
      anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
    },
    googleMaps: {
      apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    },
  },
  
  // Feature Flags
  features: {
    realTimeUpdates: true,
    checkIn: true,
    checkOut: true,
    notifications: true,
    analytics: false, // Disable for hackathon
    nlpSearch: false, // Enable if you add Claude API
  },
  
  // Map Configuration
  map: {
    defaultZoom: 16,
    minZoom: 14,
    maxZoom: 20,
    
    // USF Campus center
    center: {
      latitude: 28.0587,
      longitude: -82.4139,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    },
    
    // Map style (for Google Maps)
    style: 'standard', // Options: 'standard', 'satellite', 'hybrid', 'terrain'
  },
  
  // Parking Settings
  parking: {
    // Occupancy thresholds
    occupancy: {
      available: 60,   // < 60% = green
      limited: 85,     // 60-85% = yellow
      full: 85,        // > 85% = red
    },
    
    // Walking calculations
    walkingSpeed: 1.4, // meters per second (avg human walking speed)
    
    // Distance display
    useMetric: false, // false = feet/miles, true = meters/km
    
    // Search radius
    maxSearchRadius: 2000, // meters (2km / 1.2 miles)
    
    // Results
    defaultResultCount: 5,
    maxResultCount: 10,
  },
  
  // User Settings Defaults
  defaults: {
    permitType: 'S',
    notificationsEnabled: true,
    theme: 'dark', // Only dark mode for now
  },
  
  // Timing
  timing: {
    // How often to refresh real-time data (ms)
    realtimeRefreshInterval: 5000, // 5 seconds
    
    // How long before prompting check-out (ms)
    checkOutReminderDelay: 300000, // 5 minutes
    
    // API request timeout (ms)
    apiTimeout: 10000, // 10 seconds
    
    // Debounce for search input (ms)
    searchDebounce: 300,
  },
  
  // URLs
  urls: {
    privacy: 'https://usf.edu/privacy',
    terms: 'https://usf.edu/terms',
    support: 'mailto:support@parkabull.app',
    usfParking: 'https://www.usf.edu/administrative-services/parking/',
  },
  
  // Contact
  contact: {
    email: 'support@parkabull.app',
    phone: '(813) 974-3333',
  },
  
  // Analytics (for future)
  analytics: {
    enabled: false,
    trackingId: '',
  },
};

/**
 * Check if feature is enabled
 */
export function isFeatureEnabled(feature: keyof typeof APP_CONFIG.features): boolean {
  return APP_CONFIG.features[feature];
}

/**
 * Get occupancy threshold
 */
export function getOccupancyThreshold(type: 'available' | 'limited' | 'full'): number {
  return APP_CONFIG.parking.occupancy[type];
}

/**
 * Validate environment variables
 */
export function validateEnv(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!APP_CONFIG.api.supabase.url) {
    errors.push('EXPO_PUBLIC_SUPABASE_URL is not set');
  }
  
  if (!APP_CONFIG.api.supabase.anonKey) {
    errors.push('EXPO_PUBLIC_SUPABASE_ANON_KEY is not set');
  }
  
  if (!APP_CONFIG.api.googleMaps.apiKey) {
    errors.push('EXPO_PUBLIC_GOOGLE_MAPS_API_KEY is not set');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

export default APP_CONFIG;