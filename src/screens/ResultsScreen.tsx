import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/AppNavigator';
import { ParkingCard } from '../components/parking/ParkingCard';
import { ParkingLocation } from '../../constants/parkingLocations';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS, OPACITY } from '../../constants/theme';
import { SharedElement } from 'react-navigation-shared-element';
import MapWidget from '../components/map/MapWidget';
import { useParkingLots } from '../hooks/useParkingLots';

type ResultsScreenRouteProp = RouteProp<RootStackParamList, 'Results'>;
type ResultsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Results'>;

type FilterType = 'all' | 'S' | 'R' | 'E' | 'V';
type SortType = 'distance' | 'availability' | 'name';

const FILTERS = [
  { id: 'all' as FilterType, label: 'All', icon: 'apps' },
  { id: 'S' as FilterType, label: 'Student', icon: 'school' },
  { id: 'R' as FilterType, label: 'Resident', icon: 'home' },
  { id: 'E' as FilterType, label: 'Faculty', icon: 'briefcase' },
  { id: 'V' as FilterType, label: 'Visitor', icon: 'person' },
];

export default function ResultsScreen() {
  const route = useRoute<ResultsScreenRouteProp>();
  const navigation = useNavigation<ResultsScreenNavigationProp>();
  const { buildingName } = route.params || {};

  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('distance');
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Use real Supabase data instead of mock data
  const permitFilter = selectedFilter === 'all' ? undefined : `${selectedFilter} - ${
    selectedFilter === 'S' ? 'Student' :
    selectedFilter === 'R' ? 'Resident' :
    selectedFilter === 'E' ? 'Faculty/Staff' :
    'Visitor'
  }`;
  const { lots: supabaseLots, loading, error } = useParkingLots(permitFilter);

  // Mark initial load as complete once we have data
  React.useEffect(() => {
    if (!loading && supabaseLots) {
      setIsInitialLoad(false);
    }
  }, [loading, supabaseLots]);

  // Convert Supabase lots to ParkingLocation format for compatibility
  const filteredLots: ParkingLocation[] = (supabaseLots || []).map(lot => {
    // Convert capacity number to object format expected by ParkingCard
    const capacityObj: Record<string, number> = {};
    lot.permits.forEach(permit => {
      const permitKey = permit.split(' - ')[0]; // Extract 'S' from 'S - Student'
      capacityObj[permitKey] = Math.floor(lot.capacity / lot.permits.length);
    });

    return {
      id: lot.id,
      name: lot.name,
      shortName: lot.short_name,
      type: lot.type,
      permits: lot.permits,
      capacity: capacityObj,
      coordinates: {
        latitude: lot.latitude,
        longitude: lot.longitude,
      },
      features: lot.type === 'garage' ? ['covered', 'security-cameras'] : ['outdoor', 'well-lit'],
      floors: lot.floors || undefined,
    };
  });

  const handleParkingPress = (lot: ParkingLocation) => {
    navigation.navigate('Map', {
      latitude: lot.coordinates.latitude,
      longitude: lot.coordinates.longitude,
    });
  };

  const handleCheckIn = (lot: ParkingLocation) => {
    navigation.navigate('CheckIn', {
      parkingId: lot.id,
      parkingName: lot.shortName,
      parkingType: lot.type,
      floors: lot.floors,
    });
  };

  // Show loading state ONLY on initial load
  if (loading && isInitialLoad) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading parking lots...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error state
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#EF4444" />
          <Text style={styles.errorTitle}>Error Loading Data</Text>
          <Text style={styles.errorMessage}>{error.message}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='light-content' />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={OPACITY.pressed}
        >
          <Ionicons name='chevron-back' size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>

        <View style={styles.headerTitle}>
          <Text style={styles.title}>
            {buildingName ? `Near ${buildingName}` : 'All Parking'}
          </Text>
          <Text style={styles.subtitle}>
            {filteredLots.length} {filteredLots.length === 1 ? 'location' : 'locations'} available
          </Text>
        </View>
      </View>

      <SharedElement id="map">
        <MapWidget />
      </SharedElement>

      {/* Filters */}
      <View style={styles.filtersSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
        >
          {FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterChip,
                selectedFilter === filter.id && styles.filterChipActive
              ]}
              onPress={() => setSelectedFilter(filter.id)}
              activeOpacity={OPACITY.pressed}
            >
              <Ionicons
                name={filter.icon as any}
                size={16}
                color={selectedFilter === filter.id ? '#000' : COLORS.textSecondary}
              />
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === filter.id && styles.filterTextActive
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      {/* Sort Options */}
      <View style={styles.sortSection}>
        <TouchableOpacity
          style={styles.sortButton}
          activeOpacity={OPACITY.pressed}
        >
          <Ionicons name='swap-vertical' size={16} color={COLORS.textSecondary} />
          <Text style={styles.sortText}>
            {sortBy === 'distance' ? 'Closest First' : sortBy === 'availability' ? 'Most Available' : 'A-Z'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Parking List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredLots.map((parking, index) => {
          // Find the corresponding Supabase lot to get real occupancy data
          const supabaseLot = supabaseLots?.find(lot => lot.id === parking.id);

          return (
            <ParkingCard
              key={parking.id}
              parking={parking}
              onPress={() => handleParkingPress(parking)}
              onCheckIn={() => handleCheckIn(parking)}
              showDistance
              distance={Math.floor(Math.random() * 15) + 2}
              realCapacity={supabaseLot?.capacity}
              realOccupancy={supabaseLot?.current_occupancy}
              realOccupancyPercentage={supabaseLot?.occupancyPercentage}
            />
          );
        })}

        {filteredLots.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name='car-outline' size={64} color={COLORS.textTertiary} />
            <Text style={styles.emptyTitle}>No parking lots found</Text>
            <Text style={styles.emptySubtitle}>
              Try adjusting your filters
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
    gap: SPACING.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  mapToggle: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: `${COLORS.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filtersSection: {
    marginBottom: SPACING.base,
  },
  filtersContent: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surface,
    gap: 6,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
  },
  filterText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textSecondary,
  },
  filterTextActive: {
    color: '#000',
  },
  sortSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.base,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sortText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxxl,
  },
  emptyTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
    marginTop: SPACING.base,
  },
  emptySubtitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  loadingText: {
    marginTop: SPACING.base,
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  errorTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginTop: SPACING.base,
  },
  errorMessage: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
  retryButton: {
    marginTop: SPACING.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.button,
  },
  retryButtonText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: '#000',
  },
});