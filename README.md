# Parkabull

A comprehensive mobile parking solution for University of South Florida students featuring real-time availability tracking, intelligent search, and seamless navigation.

## Overview

Parkabull is a React Native mobile application that helps USF students find available parking spots efficiently. The app provides real-time occupancy data, location-based search, and quick access to parking near popular campus buildings.

## Features

### Core Functionality
- **Real-Time Availability** - Live parking lot occupancy data powered by Supabase
- **Intelligent Search** - Autocomplete search with building names, abbreviations, and aliases
- **Location-Based Discovery** - Find parking lots near your destination using geolocation
- **Interactive Maps** - Visual parking lot locations with native map integration
- **Check-In System** - Track your parking location and checkout when you leave
- **Quick Access** - One-tap access to parking near popular campus destinations

### User Experience
- **Status Tracking** - Visual indicators for available, limited, and full parking lots
- **Navigation Integration** - Direct links to native maps for turn-by-turn directions
- **Dark/Light Themes** - Adaptive theming for comfortable viewing
- **Offline Support** - Local data caching with AsyncStorage
- **Error Monitoring** - Sentry integration for reliability

## Tech Stack

### Frontend
- **React Native** (0.81.5) - Cross-platform mobile development
- **TypeScript** (5.9.2) - Type-safe development
- **Expo** (~54.0) - Managed workflow and development tools
- **React Navigation** (7.x) - Stack-based navigation with shared element transitions
- **NativeWind** (4.2.1) - TailwindCSS for React Native styling

### Backend & Services
- **Supabase** - PostgreSQL database with real-time subscriptions
- **Expo Location** - GPS and geolocation services
- **React Native Maps** - Native map rendering and markers

### State Management & Storage
- **AsyncStorage** - Persistent local data storage
- **Custom Hooks** - Reusable state logic (`useParkingLots`, `useAuth`, `useCheckin`)

### Developer Tools
- **Sentry** - Error tracking and performance monitoring
- **Prettier** - Code formatting with Tailwind plugin
- **Babel** - JavaScript transpilation

## Project Structure

```
park-a-bull/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── map/         # Map-related components
│   │   ├── parking/     # Parking card displays
│   │   ├── search/      # Search and autocomplete
│   │   └── ui/          # Generic UI elements
│   ├── screens/         # App screens/pages
│   ├── navigation/      # Navigation configuration
│   ├── services/        # API and business logic
│   │   ├── parkingService.ts
│   │   ├── checkinService.ts
│   │   ├── authService.ts
│   │   └── buildingService.ts
│   ├── hooks/          # Custom React hooks
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Helper functions and constants
├── assets/             # Images, icons, and fonts
├── constants/          # Theme and configuration
└── supabase/          # Database types and migrations
```

## Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Studio (for emulators)

### Setup

1. Clone the repository
```bash
git clone https://github.com/yourusername/park-a-bull.git
cd park-a-bull
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.local.example .env.local
```
Add your Supabase credentials:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server
```bash
npm start
```

5. Run on your preferred platform
```bash
npm run ios      # iOS Simulator
npm run android  # Android Emulator
npm run web      # Web browser
```

## Database Schema

The app uses Supabase with the following core tables:

**parking_lots**
- Real-time occupancy tracking
- Permit type restrictions
- GPS coordinates for location-based queries
- Capacity and current occupancy data

**checkins**
- User parking session tracking
- Timestamp-based checkout system

**buildings**
- Campus building directory
- Multiple aliases for flexible search

## Key Features Implementation

### Real-Time Updates
Implemented using Supabase real-time subscriptions to push occupancy changes to connected clients instantly.

```typescript
subscribeToParkingLots((lots) => {
  // UI updates automatically when database changes
});
```

### Geospatial Queries
Haversine formula calculates distances between user location and parking lots for proximity-based search.

### Autocomplete Search
Fuzzy matching against building names, abbreviations, and aliases with debounced input for performance.

## Performance Optimizations

- Lazy loading of map markers
- Virtualized lists for parking lot results
- Image optimization with Expo's asset pipeline
- Memoized components to prevent unnecessary re-renders
- Local caching with AsyncStorage

## Error Handling

Integrated Sentry for:
- Real-time error tracking
- Performance monitoring
- Session replay (10% sampling)
- User feedback collection

## Development

### Code Quality
- TypeScript for type safety
- Prettier for consistent formatting
- Component-based architecture
- Custom hooks for reusable logic

### Testing
Test helpers available in `src/utils/testHelpers.ts` with mock data for development.

## Deployment

The app is configured for deployment through Expo Application Services (EAS):

```bash
eas build --platform ios
eas build --platform android
```

## Contributing

This project was developed for the USF community. Contributions are welcome.

## License

MIT License - See LICENSE file for details

## Contact

For questions or feedback, please open an issue on GitHub.

---

Built with React Native and Supabase for the University of South Florida community.
