import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/AppNavigator';
import { ParkingCard } from '../components/parking/ParkingCard';
import { USF_PARKING_LOTS, getParkingLotsByPermit, ParkingLocation } from '../../constants/parkingLocations';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS, OPACITY } from '../../constants/theme';
import { SharedElement } from 'react-navigation-shared-element';
import MapWidget from '../components/map/MapWidget';

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

  const filteredLots = selectedFilter === 'all'
    ? USF_PARKING_LOTS
    : getParkingLotsByPermit(selectedFilter);

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
        {filteredLots.map((parking, index) => (
          <ParkingCard
            key={parking.id}
            parking={parking}
            onPress={() => handleParkingPress(parking)}
            onCheckIn={() => handleCheckIn(parking)}
            showDistance
            distance={Math.floor(Math.random() * 15) + 2}
          />
        ))}

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
});