// src/theme/theme.ts

/**
 * parkabull Design System
 * Modern dark theme inspired by iOS and premium mobile apps
 */

export const COLORS = {
  // Backgrounds
  background: '#000000',        // Pure black (OLED friendly)
  backgroundSoft: '#0a0a0a',   // Slightly lighter black
  surface: '#1c1c1e',          // iOS dark card/surface color
  surfaceLight: '#2c2c2e',     // Elevated surfaces
  surfacePressed: '#3a3a3c',   // Pressed state
  
  // Brand Colors
  primary: '#00D66C',          // Bright green (main brand)
  primaryDark: '#00B359',      // Darker green (pressed)
  primaryLight: '#00FF7F',     // Lighter green (hover)
  
  // Status Colors (Parking Availability)
  success: '#4CAF50',          // Available parking (green)
  successBg: '#1B5E20',        // Success background
  warning: '#FFC107',          // Limited parking (yellow)
  warningBg: '#F57F17',        // Warning background
  error: '#F44336',            // Full parking (red)
  errorBg: '#B71C1C',          // Error background
  
  // Text Colors
  textPrimary: '#FFFFFF',      // Primary text (white)
  textSecondary: '#8E8E93',    // Secondary text (iOS gray)
  textTertiary: '#636366',     // Tertiary text (dimmer)
  textDisabled: '#48484A',     // Disabled text
  
  // Accent Colors
  accent: '#007AFF',           // iOS blue for links
  accentSecondary: '#5856D6',  // Purple accent
  
  // UI Elements
  border: '#38383A',           // Subtle borders
  divider: '#2C2C2E',          // Dividers/separators
  overlay: 'rgba(0, 0, 0, 0.5)', // Modal overlays
  
  // Map Colors
  mapMarkerGreen: '#34C759',   // Available lot marker
  mapMarkerYellow: '#FFCC00',  // Limited lot marker
  mapMarkerRed: '#FF3B30',     // Full lot marker
  mapMarkerBlue: '#007AFF',    // User location
  
  // Gradients (for special effects)
  gradientStart: '#00D66C',
  gradientEnd: '#00B359',
};

export const SPACING = {
  // Base spacing scale (multiples of 4)
  xs: 4,    // 4px
  sm: 8,    // 8px
  md: 12,   // 12px
  base: 16, // 16px (default)
  lg: 24,   // 24px
  xl: 32,   // 32px
  xxl: 48,  // 48px
  xxxl: 64, // 64px
  
  // Semantic spacing
  screenPadding: 24,      // Horizontal screen padding
  cardPadding: 16,        // Padding inside cards
  sectionGap: 32,         // Gap between sections
  cardGap: 12,            // Gap between cards
  buttonPadding: 16,      // Button internal padding
  
  // Component-specific
  searchBarHeight: 52,
  quickAccessCardSize: 120, // Minimum height for quick access cards
  mapHeight: 200,           // Map view height on results screen
  navBarHeight: 56,         // Navigation bar height
};

export const TYPOGRAPHY = {
  // Font Families (system defaults)
  fontFamily: {
    regular: 'System',      // San Francisco on iOS, Roboto on Android
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },
  
  // Font Sizes
  fontSize: {
    xs: 12,    // Small labels
    sm: 14,    // Secondary text
    base: 16,  // Body text
    lg: 18,    // Emphasized text
    xl: 20,    // Section headers
    xxl: 24,   // Screen titles
    xxxl: 32,  // Large titles
    display: 36, // App name, hero text
  },
  
  // Font Weights
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    heavy: '800' as const,
  },
  
  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const BORDER_RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  full: 9999, // For pill shapes
  
  // Semantic
  card: 24,
  button: 16,
  input: 28,  // Pill-shaped inputs
};

export const SHADOWS = {
  // iOS-style shadows
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // Android
  },
  
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  
  // Semantic shadows
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  
  button: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
};

export const OPACITY = {
  disabled: 0.4,
  pressed: 0.7,
  overlay: 0.5,
  subtle: 0.6,
};

export const TIMING = {
  // Animation durations (ms)
  fast: 150,
  normal: 250,
  slow: 350,
  
  // Easing curves
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
};

export const LAYOUT = {
  // Screen dimensions
  maxWidth: 428,  // Max width for tablet/large screens
  
  // Component heights
  tabBar: 80,
  header: 56,
  searchBar: 52,
  button: 52,
  buttonSmall: 40,
  
  // Grid
  columns: 2, // For quick access grid
  
  // Touch targets
  minTouchTarget: 44, // iOS minimum
};

// Utility function to get occupancy color
export const getOccupancyColor = (percentage: number) => {
  if (percentage < 60) return COLORS.success;
  if (percentage < 85) return COLORS.warning;
  return COLORS.error;
};

// Utility function to get occupancy status
export const getOccupancyStatus = (percentage: number): 'available' | 'limited' | 'full' => {
  if (percentage < 60) return 'available';
  if (percentage < 85) return 'limited';
  return 'full';
};

// Utility function to get status emoji
export const getStatusEmoji = (percentage: number): string => {
  if (percentage < 60) return '🟢';
  if (percentage < 85) return '🟡';
  return '🔴';
};

// Common component styles
export const COMMON_STYLES = {
  // Screen container
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  // Screen with padding
  screenPadded: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.screenPadding,
  },
  
  // Card
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.card,
    padding: SPACING.cardPadding,
    ...SHADOWS.card,
  },
  
  // Button (primary)
  buttonPrimary: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.button,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    ...SHADOWS.button,
  },
  
  // Button (secondary)
  buttonSecondary: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.button,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  
  // Input
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.input,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.fontSize.base,
  },
  
  // Text styles
  heading1: {
    fontSize: TYPOGRAPHY.fontSize.display,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    lineHeight: TYPOGRAPHY.fontSize.display * TYPOGRAPHY.lineHeight.tight,
  },
  
  heading2: {
    fontSize: TYPOGRAPHY.fontSize.xxxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  
  heading3: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
  },
  
  body: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.regular,
    color: COLORS.textPrimary,
    lineHeight: TYPOGRAPHY.fontSize.base * TYPOGRAPHY.lineHeight.normal,
  },
  
  bodySecondary: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.regular,
    color: COLORS.textSecondary,
  },
  
  caption: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.regular,
    color: COLORS.textSecondary,
  },
  
  // Divider
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: SPACING.base,
  },
};

// USF-specific constants
export const USF_CONSTANTS = {
  // Campus center coordinates
  campus: {
    latitude: 28.0587,
    longitude: -82.4139,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  },
  
  // Permit types
  permitTypes: ['S', 'R', 'E', 'V'] as const,
  
  permitLabels: {
    S: 'Student Commuter',
    R: 'Resident',
    E: 'Faculty/Staff',
    V: 'Visitor',
  },
  
  // Walking speed (meters per second)
  walkingSpeed: 1.4,
};

export type PermitType = typeof USF_CONSTANTS.permitTypes[number];

// Export default theme object
export default {
  colors: COLORS,
  spacing: SPACING,
  typography: TYPOGRAPHY,
  borderRadius: BORDER_RADIUS,
  shadows: SHADOWS,
  opacity: OPACITY,
  timing: TIMING,
  layout: LAYOUT,
  common: COMMON_STYLES,
  usf: USF_CONSTANTS,
};