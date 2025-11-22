# Supabase Integration Setup Guide

This guide walks you through setting up Supabase as the backend for Park-a-Bull.

## Prerequisites

- A Supabase account (free tier works fine)
- Your Supabase project created at https://supabase.com

## Step 1: Configure Environment Variables

Your `.env.local` file is already configured with:
```env
EXPO_PUBLIC_SUPABASE_URL=https://ekwtyszfxrhsyomkwrbo.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

✅ **Status**: Environment variables are set up correctly!

## Step 2: Create Database Schema

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the contents of `supabase/schema.sql`
5. Click **Run** to execute the SQL

This will create:
- `buildings` table - Campus buildings with coordinates
- `parking_lots` table - Parking locations with real-time occupancy
- `profiles` table - User profiles and permit types
- `checkins` table - User check-in/check-out records
- Indexes for optimal query performance
- Row Level Security (RLS) policies for data protection
- Triggers for automatic occupancy tracking

## Step 3: Seed Initial Data

1. In the SQL Editor, create another new query
2. Copy and paste the contents of `supabase/seed.sql`
3. Click **Run** to populate the database

This will add:
- 6 campus buildings (Library, MSC, Rec Center, etc.)
- 10 parking lots/garages with current occupancy data

## Step 4: Enable Authentication (Optional but Recommended)

For user check-ins and profiles, you'll need authentication:

1. Go to **Authentication** → **Providers** in your Supabase dashboard
2. Enable **Email** provider (enabled by default)
3. (Optional) Enable **Anonymous sign-ins** for testing:
   - Go to Authentication → Settings
   - Enable "Allow anonymous sign-ins"

## Step 5: Verify Setup

Run this test query in SQL Editor to verify everything works:

```sql
-- Check if tables exist and have data
SELECT 'buildings' as table_name, COUNT(*) as count FROM buildings
UNION ALL
SELECT 'parking_lots', COUNT(*) FROM parking_lots
UNION ALL
SELECT 'profiles', COUNT(*) FROM profiles
UNION ALL
SELECT 'checkins', COUNT(*) FROM checkins;
```

You should see:
- buildings: 6
- parking_lots: 10
- profiles: 0 (will populate as users sign up)
- checkins: 0 (will populate as users check in)

## Using the Services in Your App

### 1. Fetching Parking Lots

```typescript
import { useParkingLots } from '../hooks/useParkingLots';

function MyComponent() {
  const { lots, loading, error } = useParkingLots();

  // Or filter by permit type:
  // const { lots, loading, error } = useParkingLots('S - Student');

  if (loading) return <ActivityIndicator />;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View>
      {lots.map(lot => (
        <Text key={lot.id}>{lot.name}: {lot.availableSpots} spots</Text>
      ))}
    </View>
  );
}
```

### 2. User Authentication

```typescript
import { useAuth } from '../hooks/useAuth';
import { signInAnonymously } from '../services/authService';

function HomeScreen() {
  const { user, profile, loading } = useAuth();

  const handleQuickStart = async () => {
    const { user, error } = await signInAnonymously();
    if (error) {
      Alert.alert('Error', error.message);
    }
  };

  if (loading) return <ActivityIndicator />;

  if (!user) {
    return <Button title="Get Started" onPress={handleQuickStart} />;
  }

  return <Text>Welcome! Permit: {profile?.permit_type}</Text>;
}
```

### 3. Check-in Flow

```typescript
import { createCheckin } from '../services/checkinService';
import { useAuth } from '../hooks/useAuth';

function CheckInScreen({ lotId, permitType, floor }) {
  const { user } = useAuth();

  const handleCheckin = async () => {
    if (!user) {
      Alert.alert('Error', 'Please sign in first');
      return;
    }

    try {
      await createCheckin(user.id, lotId, permitType, floor);
      Alert.alert('Success', 'Checked in successfully!');
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <Button title="Confirm Check-In" onPress={handleCheckin} />
  );
}
```

### 4. Active Check-in Status

```typescript
import { useCheckin } from '../hooks/useCheckin';
import { useAuth } from '../hooks/useAuth';
import { checkOut } from '../services/checkinService';

function HomeScreen() {
  const { user } = useAuth();
  const { activeCheckin, loading, refresh } = useCheckin(user?.id);

  const handleCheckout = async () => {
    if (!activeCheckin) return;

    try {
      await checkOut(activeCheckin.id);
      refresh();
      Alert.alert('Success', 'Checked out successfully!');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  if (activeCheckin) {
    return (
      <View>
        <Text>Parked at: {activeCheckin.lot_name}</Text>
        <Text>Since: {new Date(activeCheckin.checked_in_at).toLocaleTimeString()}</Text>
        <Button title="Check Out" onPress={handleCheckout} />
      </View>
    );
  }

  return <Text>No active parking session</Text>;
}
```

## Real-time Updates

The app automatically subscribes to real-time changes in parking lot occupancy. When any user checks in or out, all connected clients will see the updated availability instantly!

## Available Services

### Auth Service (`src/services/authService.ts`)
- `signUp(email, password, permitType)` - Create new user
- `signIn(email, password)` - Sign in existing user
- `signInAnonymously()` - Quick anonymous sign-in
- `signOut()` - Sign out current user
- `getCurrentUser()` - Get current user
- `subscribeToAuthChanges(callback)` - Listen to auth state

### Parking Service (`src/services/parkingService.ts`)
- `getAllParkingLots()` - Get all parking locations
- `getParkingLotsByPermit(permitType)` - Filter by permit
- `getParkingLotById(id)` - Get single lot
- `getParkingLotsNearLocation(lat, lng, radius)` - Find nearby lots
- `subscribeToParkingLots(callback)` - Real-time updates

### Building Service (`src/services/buildingService.ts`)
- `getAllBuildings()` - Get all campus buildings
- `searchBuildings(query)` - Search by name/abbreviation/aliases
- `getBuildingById(id)` - Get single building
- `getBuildingByName(name)` - Find by exact name

### Checkin Service (`src/services/checkinService.ts`)
- `createCheckin(userId, lotId, permitType, floor, spot)` - Check in
- `checkOut(checkinId)` - Check out
- `getActiveCheckin(userId)` - Get current active check-in
- `getUserCheckins(userId, limit)` - Get check-in history
- `getWeeklyCheckinCount(userId)` - Get weekly stats
- `subscribeToUserCheckins(userId, callback)` - Real-time updates

### Profile Service (`src/services/profileService.ts`)
- `getProfile(userId)` - Get user profile
- `createProfile(userId, permitType)` - Create new profile
- `updateProfile(userId, updates)` - Update profile
- `getOrCreateProfile(userId, permitType)` - Get or create

## Troubleshooting

### "relation does not exist" error
- Make sure you ran `schema.sql` in the SQL Editor

### "row level security policy" error
- The RLS policies are set up correctly in schema.sql
- Make sure you're signed in when accessing user-specific data

### Real-time not working
- Check your Supabase project's Realtime settings
- Ensure the tables have Realtime enabled (should be automatic)

### Data not showing
- Make sure you ran `seed.sql` to populate initial data
- Check the SQL Editor to verify data exists

## Next Steps

1. ✅ Run `schema.sql` in Supabase SQL Editor
2. ✅ Run `seed.sql` to populate data
3. Update your screens to use the hooks and services
4. Test authentication flow
5. Test check-in/check-out flow
6. Verify real-time updates work

Happy coding! 🚗
