# Integration Example: Using Supabase in Screens

This document shows how to update your existing screens to use Supabase data instead of mock data.

## Example 1: HomeScreen with Real-Time Check-in Status

Here's how to update `HomeScreen.tsx` to show real active check-ins:

```typescript
import { useAuth } from '../hooks/useAuth';
import { useCheckin } from '../hooks/useCheckin';
import { checkOut } from '../services/checkinService';

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');

  // Add authentication
  const { user, profile, loading: authLoading } = useAuth();

  // Add active check-in tracking
  const { activeCheckin, loading: checkinLoading, refresh } = useCheckin(user?.id);

  const handleCheckout = async () => {
    if (!activeCheckin) return;

    try {
      await checkOut(activeCheckin.id);
      refresh(); // Refresh the check-in status
      Alert.alert('Success', 'You have checked out successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to check out. Please try again.');
    }
  };

  // Show loading state while checking auth
  if (authLoading || checkinLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header stays the same */}

        {/* Currently Parked Card - now uses real data */}
        {activeCheckin && (
          <View style={styles.section}>
            <Card variant="elevated" padding="lg">
              <View style={styles.parkedHeader}>
                <Text style={styles.parkedTitle}>Currently Parked</Text>
                <View style={styles.statusBadge}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>Active</Text>
                </View>
              </View>

              <View style={styles.parkedInfo}>
                <View style={styles.parkingIcon}>
                  <Ionicons name='car' size={28} color={COLORS.primary} />
                </View>
                <View style={styles.parkedDetails}>
                  <Text style={styles.parkingName}>{activeCheckin.lot_name}</Text>
                  <Text style={styles.parkingTime}>
                    Since {new Date(activeCheckin.checked_in_at).toLocaleTimeString()}
                    {activeCheckin.floor && ` • Floor ${activeCheckin.floor}`}
                    {activeCheckin.spot_number && `, Spot ${activeCheckin.spot_number}`}
                  </Text>
                </View>
              </View>

              <View style={styles.parkedActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  activeOpacity={OPACITY.pressed}
                  onPress={openNativeMaps}
                >
                  <Ionicons name='navigate' size={18} color={COLORS.textPrimary} />
                  <Text style={styles.actionButtonText}>Directions</Text>
                </TouchableOpacity>

                <View style={styles.divider} />

                <TouchableOpacity
                  style={[styles.actionButton, styles.checkoutButton]}
                  activeOpacity={OPACITY.pressed}
                  onPress={handleCheckout}
                >
                  <Ionicons name='checkmark-circle' size={18} color={COLORS.primary} />
                  <Text style={[styles.actionButtonText, styles.checkoutText]}>Check Out</Text>
                </TouchableOpacity>
              </View>
            </Card>
          </View>
        )}

        {/* Rest of the screen stays the same */}
      </ScrollView>
    </SafeAreaView>
  );
}
```

## Example 2: ResultsScreen with Real Parking Data

Update `ResultsScreen.tsx` to fetch parking lots from Supabase:

```typescript
import { useParkingLots } from '../hooks/useParkingLots';
import { ActivityIndicator } from 'react-native';

export default function ResultsScreen() {
  const route = useRoute<ResultsScreenRouteProp>();
  const navigation = useNavigation<ResultsScreenNavigationProp>();
  const { buildingName } = route.params || {};

  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');

  // Replace mock data with real Supabase data
  const permitType = selectedFilter === 'all' ? undefined : selectedFilter;
  const { lots, loading, error } = useParkingLots(permitType);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={{ marginTop: 10, color: COLORS.textSecondary }}>
            Loading parking lots...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Ionicons name="alert-circle" size={48} color={COLORS.error} />
          <Text style={{ marginTop: 10, color: COLORS.error, textAlign: 'center' }}>
            Error loading parking lots
          </Text>
          <Text style={{ marginTop: 5, color: COLORS.textSecondary, textAlign: 'center' }}>
            {error.message}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          {buildingName ? `Near ${buildingName}` : 'All Parking'}
        </Text>
        <Text style={styles.subtitle}>
          {lots.length} {lots.length === 1 ? 'location' : 'locations'} available
        </Text>
      </View>

      {/* Filters */}
      <View style={styles.filtersSection}>
        {/* Filter chips - same as before */}
      </View>

      {/* Parking Lot List - now with real data */}
      <ScrollView>
        {lots.map((lot) => (
          <ParkingCard
            key={lot.id}
            lot={{
              id: lot.id,
              shortName: lot.short_name,
              fullName: lot.name,
              type: lot.type,
              permits: lot.permits,
              capacity: lot.capacity,
              available: lot.availableSpots,
              occupancy: lot.occupancyPercentage,
              distance: '0.3 mi', // Calculate based on user location
              walkTime: '5 min',
              coordinates: {
                latitude: lot.latitude,
                longitude: lot.longitude,
              },
              floors: lot.floors || undefined,
            }}
            onPress={() => handleParkingPress(lot)}
            onCheckIn={() => handleCheckIn(lot)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
```

## Example 3: CheckInScreen with Database Integration

Update `CheckInScreen.tsx` to save check-ins to the database:

```typescript
import { useAuth } from '../hooks/useAuth';
import { createCheckin } from '../services/checkinService';
import { getWeeklyCheckinCount } from '../services/checkinService';

export default function CheckInScreen() {
  const navigation = useNavigation<CheckInScreenNavigationProp>();
  const route = useRoute<CheckInScreenRouteProp>();
  const { parkingId, parkingName, parkingType, floors } = route.params;

  const { user, profile } = useAuth();
  const [selectedFloor, setSelectedFloor] = useState<number>(1);
  const [spotNumber, setSpotNumber] = useState<string>('');
  const [weeklyCheckIns, setWeeklyCheckIns] = useState(0);
  const [loading, setLoading] = useState(false);

  // Load weekly check-in count
  useEffect(() => {
    if (user) {
      getWeeklyCheckinCount(user.id).then(setWeeklyCheckIns);
    }
  }, [user]);

  const handleConfirm = async () => {
    if (!user) {
      Alert.alert('Error', 'Please sign in to check in');
      return;
    }

    if (!profile) {
      Alert.alert('Error', 'Profile not found');
      return;
    }

    setLoading(true);

    try {
      // Create check-in in database
      await createCheckin(
        user.id,
        parkingId,
        profile.permit_type,
        parkingType === 'garage' ? selectedFloor : undefined,
        spotNumber || undefined
      );

      Alert.alert('Success', 'Checked in successfully!');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Check-in error:', error);
      Alert.alert('Error', 'Failed to check in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Thank You Header - same as before */}

        {/* Parking Details Card - same as before */}

        {/* Floor Selection - same as before */}

        {/* Weekly Stats Card - now with real data */}
        <View style={styles.section}>
          <Card variant="elevated" padding="lg">
            <View style={styles.statsHeader}>
              <Ionicons name='bar-chart' size={24} color={COLORS.primary} />
              <Text style={styles.cardTitle}>This Week's Activity</Text>
            </View>

            <View style={styles.statsContent}>
              <View style={styles.statsBadge}>
                <Text style={styles.statsNumber}>{weeklyCheckIns}</Text>
                <Text style={styles.statsLabel}>Check-ins</Text>
              </View>
              <Text style={styles.statsMessage}>
                {weeklyCheckIns >= 5
                  ? "You're a parking pro! 🎉"
                  : "Keep tracking your parking!"}
              </Text>
            </View>
          </Card>
        </View>

        {/* Confirm Button - now saves to database */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.confirmButton, loading && { opacity: 0.6 }]}
            onPress={handleConfirm}
            activeOpacity={OPACITY.pressed}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <>
                <Text style={styles.confirmButtonText}>Confirm Check-In</Text>
                <Ionicons name='arrow-forward' size={20} color='#000' />
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
```

## Quick Start: Anonymous Sign-In

To get started quickly without requiring user registration, add this to your `App.tsx` or `HomeScreen.tsx`:

```typescript
import { useEffect } from 'react';
import { signInAnonymously } from './src/services/authService';
import { useAuth } from './src/hooks/useAuth';

function App() {
  const { user, loading } = useAuth();

  useEffect(() => {
    // Auto sign-in anonymously if no user
    if (!loading && !user) {
      signInAnonymously().catch(console.error);
    }
  }, [user, loading]);

  // Rest of your app
}
```

## Key Changes Summary

1. **Replace mock data imports** with service imports:
   ```typescript
   // Before
   import { mockLots } from '../utils/mockData';

   // After
   import { useParkingLots } from '../hooks/useParkingLots';
   ```

2. **Add authentication** to screens that need user data:
   ```typescript
   const { user, profile, loading } = useAuth();
   ```

3. **Use hooks** for data fetching:
   ```typescript
   const { lots, loading, error } = useParkingLots();
   ```

4. **Handle loading and error states**:
   ```typescript
   if (loading) return <ActivityIndicator />;
   if (error) return <ErrorView error={error} />;
   ```

5. **Replace state updates** with service calls:
   ```typescript
   // Before
   setIsParked(false);

   // After
   await checkOut(activeCheckin.id);
   ```

That's it! Your app is now fully integrated with Supabase! 🎉
