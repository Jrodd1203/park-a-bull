import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, TextInput, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/AppNavigator';
import { mockBuildings } from '../utils/mockData';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS, OPACITY } from '../../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_HORIZONTAL_PADDING = SPACING.lg * 2; // Left and right padding
const CARD_GAP = SPACING.md;
const CARD_WIDTH = (SCREEN_WIDTH - CARD_HORIZONTAL_PADDING - CARD_GAP) / 2;

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface QuickAccessItem {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  destination?: string;
}

const QUICK_ACCESS_ITEMS: QuickAccessItem[] = [
  { id: '1', title: 'Library', icon: 'library-outline', destination: 'Library' },
  { id: '2', title: 'Student Center', icon: 'business-outline', destination: 'Marshall Student Center' },
  { id: '3', title: 'Rec Center', icon: 'fitness-outline', destination: 'Recreation Center' },
  { id: '4', title: 'Engineering', icon: 'construct-outline', destination: 'Engineering Building' },
];

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [isParked, setIsParked] = useState(true);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      return;
    }

    const foundBuilding = mockBuildings.find(
      (building) =>
        building.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        building.abbreviation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        building.aliases.some((alias) =>
          alias.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    if (foundBuilding) {
      navigation.navigate('Results', {
        buildingName: foundBuilding.name,
      });
    }
  };

  const handleQuickAccess = (destination?: string) => {
    if (!destination) return;
    navigation.navigate('Results', { buildingName: destination });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='light-content' />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Parkabull</Text>
          <Text style={styles.subtitle}>Find your perfect spot</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name='search' size={20} color={COLORS.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder='Search for a building...'
              placeholderTextColor={COLORS.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType='search'
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name='close-circle' size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Currently Parked Card */}
        {isParked && (
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
                  <Text style={styles.parkingName}>Crescent Hill Garage</Text>
                  <Text style={styles.parkingTime}>Since 9:30 AM • Floor 2, Spot A4</Text>
                </View>
              </View>

              <View style={styles.parkedActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  activeOpacity={OPACITY.pressed}
                  onPress={() => navigation.navigate('Map')}
                >
                  <Ionicons name='navigate' size={18} color={COLORS.textPrimary} />
                  <Text style={styles.actionButtonText}>Directions</Text>
                </TouchableOpacity>

                <View style={styles.divider} />

                <TouchableOpacity
                  style={[styles.actionButton, styles.checkoutButton]}
                  activeOpacity={OPACITY.pressed}
                  onPress={() => setIsParked(false)}
                >
                  <Ionicons name='checkmark-circle' size={18} color={COLORS.primary} />
                  <Text style={[styles.actionButtonText, styles.checkoutText]}>Check Out</Text>
                </TouchableOpacity>
              </View>
            </Card>
          </View>
        )}

        {/* Quick Access */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <View style={styles.quickAccessGrid}>
            {QUICK_ACCESS_ITEMS.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.quickAccessCard}
                activeOpacity={OPACITY.pressed}
                onPress={() => handleQuickAccess(item.destination)}
              >
                <View style={styles.quickAccessIcon}>
                  <Ionicons name={item.icon} size={28} color={COLORS.primary} />
                </View>
                <Text style={styles.quickAccessText}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Browse All */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.browseButton}
            activeOpacity={OPACITY.pressed}
            onPress={() => navigation.navigate('Results', {})}
          >
            <Text style={styles.browseButtonText}>Browse All Parking Lots</Text>
            <Ionicons name='chevron-forward' size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.xxxl,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.display,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.primary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  searchContainer: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.input,
    paddingHorizontal: SPACING.base,
    height: 52,
    gap: SPACING.sm,
    ...SHADOWS.small,
  },
  searchInput: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.fontSize.base,
  },
  section: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.base,
  },
  parkedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.base,
  },
  parkedTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.primary}15`,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.sm,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },
  statusText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.primary,
  },
  parkedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.base,
  },
  parkingIcon: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: `${COLORS.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  parkedDetails: {
    flex: 1,
  },
  parkingName: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  parkingTime: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  parkedActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
    gap: SPACING.base,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surfaceLight,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.sm,
  },
  actionButtonText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.border,
  },
  checkoutButton: {
    backgroundColor: `${COLORS.primary}15`,
  },
  checkoutText: {
    color: COLORS.primary,
  },
  quickAccessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAccessCard: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.card,
    padding: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
  },
  quickAccessIcon: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: `${COLORS.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  quickAccessText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  browseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.base,
    gap: SPACING.sm,
  },
  browseButtonText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.primary,
  },
});

