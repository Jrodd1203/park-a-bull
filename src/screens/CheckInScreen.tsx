import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS, OPACITY } from '../../constants/theme';

type CheckInScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CheckIn'>;
type CheckInScreenRouteProp = RouteProp<RootStackParamList, 'CheckIn'>;

export default function CheckInScreen() {
  const navigation = useNavigation<CheckInScreenNavigationProp>();
  const route = useRoute<CheckInScreenRouteProp>();
  const { parkingId, parkingName, parkingType, floors } = route.params;

  const [selectedFloor, setSelectedFloor] = useState<number>(1);
  const [spotNumber, setSpotNumber] = useState<string>('');

  // Mock data - in real app, this would come from backend
  const weeklyCheckIns = 5;
  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });

  const handleConfirm = () => {
    // In a real app, this would save to backend
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='light-content' />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Thank You Header */}
        <View style={styles.header}>
          <View style={styles.successIcon}>
            <Ionicons name='checkmark-circle' size={64} color={COLORS.primary} />
          </View>
          <Text style={styles.thankYouTitle}>Thank You for Checking In!</Text>
          <Text style={styles.thankYouSubtitle}>Your parking spot is confirmed</Text>
        </View>

        {/* Parking Details Card */}
        <View style={styles.section}>
          <Card variant="elevated" padding="lg">
            <View style={styles.cardHeader}>
              <Ionicons name='location' size={24} color={COLORS.primary} />
              <Text style={styles.cardTitle}>Parking Details</Text>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Ionicons name='business' size={20} color={COLORS.textSecondary} />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Location</Text>
                <Text style={styles.detailValue}>{parkingName}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Ionicons name='time' size={20} color={COLORS.textSecondary} />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Check-In Time</Text>
                <Text style={styles.detailValue}>{currentTime}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Ionicons name='car' size={20} color={COLORS.textSecondary} />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Parking Type</Text>
                <Text style={styles.detailValue}>
                  {parkingType === 'garage' ? `Parking Garage` : 'Surface Lot'}
                </Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Floor Selection (Garages Only) */}
        {parkingType === 'garage' && floors && (
          <View style={styles.section}>
            <Card variant="elevated" padding="lg">
              <View style={styles.cardHeader}>
                <Ionicons name='layers' size={24} color={COLORS.primary} />
                <Text style={styles.cardTitle}>Select Your Floor</Text>
              </View>
              <Text style={styles.helperText}>
                Optional: Help you remember where you parked
              </Text>

              <View style={styles.floorGrid}>
                {Array.from({ length: floors }, (_, i) => i + 1).map((floor) => (
                  <TouchableOpacity
                    key={floor}
                    style={[
                      styles.floorButton,
                      selectedFloor === floor && styles.floorButtonSelected,
                    ]}
                    onPress={() => setSelectedFloor(floor)}
                    activeOpacity={OPACITY.pressed}
                  >
                    <Text
                      style={[
                        styles.floorButtonText,
                        selectedFloor === floor && styles.floorButtonTextSelected,
                      ]}
                    >
                      Floor {floor}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Card>
          </View>
        )}

        {/* Reminder Card */}
        <View style={styles.section}>
          <Card variant="elevated" padding="lg">
            <View style={styles.reminderHeader}>
              <View style={styles.reminderIconContainer}>
                <Ionicons name='notifications' size={28} color={COLORS.primary} />
              </View>
              <View style={styles.reminderContent}>
                <Text style={styles.reminderTitle}>Check-Out Reminder</Text>
                <Text style={styles.reminderText}>
                  We'll remind you to check out when you leave campus. This helps keep parking data accurate for other students!
                </Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Weekly Stats Card */}
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

        {/* Confirm Button */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirm}
            activeOpacity={OPACITY.pressed}
          >
            <Text style={styles.confirmButtonText}>Confirm Check-In</Text>
            <Ionicons name='arrow-forward' size={20} color='#000' />
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
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  successIcon: {
    marginBottom: SPACING.base,
  },
  thankYouTitle: {
    fontSize: TYPOGRAPHY.fontSize.xxxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  thankYouSubtitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.base,
  },
  cardTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  detailIcon: {
    width: 40,
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
  },
  helperText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.base,
  },
  floorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginTop: SPACING.sm,
  },
  floorButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.surfaceLight,
    paddingVertical: SPACING.base,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  floorButtonSelected: {
    backgroundColor: `${COLORS.primary}20`,
    borderColor: COLORS.primary,
  },
  floorButtonText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
  },
  floorButtonTextSelected: {
    color: COLORS.primary,
  },
  reminderHeader: {
    flexDirection: 'row',
    gap: SPACING.base,
  },
  reminderIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: `${COLORS.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reminderContent: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  reminderText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.fontSize.base * 1.5,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.base,
  },
  statsContent: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  statsBadge: {
    alignItems: 'center',
    marginBottom: SPACING.base,
  },
  statsNumber: {
    fontSize: 56,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.primary,
    lineHeight: 64,
  },
  statsLabel: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  statsMessage: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.textPrimary,
    textAlign: 'center',
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.button,
    gap: SPACING.sm,
    ...SHADOWS.button,
  },
  confirmButtonText: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: '#000',
  },
});
