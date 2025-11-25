import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../../constants/theme';
import { ParkingLocation } from '../../../constants/parkingLocations';

interface ParkingCardProps {
  parking: ParkingLocation;
  onPress?: () => void;
  onCheckIn?: () => void;
  showDistance?: boolean;
  distance?: number;
  realCapacity?: number;
  realOccupancy?: number;
  realOccupancyPercentage?: number;
}

export function ParkingCard({
  parking,
  onPress,
  onCheckIn,
  showDistance,
  distance,
  realCapacity,
  realOccupancy,
  realOccupancyPercentage
}: ParkingCardProps) {
  // Use real data if provided, otherwise calculate from capacity object
  const totalCapacity = realCapacity || Object.values(parking.capacity).reduce((a, b) => a + b, 0);
  const occupied = realOccupancy !== undefined ? realOccupancy : Math.floor(Math.random() * totalCapacity);
  const occupancyPercentage = realOccupancyPercentage !== undefined ? Math.round(realOccupancyPercentage) : Math.round((occupied / totalCapacity) * 100);

  const availabilityColor =
    occupancyPercentage < 60 ? COLORS.success :
    occupancyPercentage < 85 ? COLORS.warning :
    COLORS.error;

  const availabilityText =
    occupancyPercentage < 60 ? 'Available' :
    occupancyPercentage < 85 ? 'Limited' :
    'Full';

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} disabled={!onPress}>
      <Card variant="elevated" padding="lg" style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={[styles.icon, { backgroundColor: `${availabilityColor}15` }]}>
              <Ionicons
                name={parking.type === 'garage' ? 'business' : 'car'}
                size={24}
                color={availabilityColor}
              />
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.name} numberOfLines={1}>
                {parking.shortName}
              </Text>
              <Text style={styles.type}>
                {parking.type === 'garage' ? `${parking.floors} Floors` : 'Surface Lot'}
              </Text>
            </View>
          </View>

          {showDistance && distance !== undefined && (
            <View style={styles.distanceBadge}>
              <Ionicons name="walk" size={14} color={COLORS.textSecondary} />
              <Text style={styles.distanceText}>{distance} min</Text>
            </View>
          )}
        </View>

        {/* Availability */}
        <View style={styles.availability}>
          <View style={styles.availabilityLeft}>
            <View style={[styles.statusDot, { backgroundColor: availabilityColor }]} />
            <Text style={[styles.availabilityText, { color: availabilityColor }]}>
              {availabilityText}
            </Text>
            <Text style={styles.occupancyText}>
              {totalCapacity - occupied} of {totalCapacity} spots
            </Text>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${occupancyPercentage}%`,
                    backgroundColor: availabilityColor
                  }
                ]}
              />
            </View>
            <Text style={styles.percentageText}>{occupancyPercentage}%</Text>
          </View>
        </View>

        {/* Permits */}
        <View style={styles.permits}>
          <Text style={styles.permitsLabel}>Permits:</Text>
          <View style={styles.permitBadges}>
            {parking.permits.map((permit) => (
              <View key={permit} style={styles.permitBadge}>
                <Text style={styles.permitText}>{getPermitLabel(permit)}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Features */}
        {parking.features.length > 0 && (
          <View style={styles.features}>
            {parking.features.slice(0, 3).map((feature, index) => (
              <View key={index} style={styles.feature}>
                <Ionicons
                  name={getFeatureIcon(feature)}
                  size={14}
                  color={COLORS.textSecondary}
                />
                <Text style={styles.featureText}>{formatFeature(feature)}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Check In Button */}
        {onCheckIn && (
          <TouchableOpacity
            style={styles.checkInButton}
            onPress={onCheckIn}
            activeOpacity={0.7}
          >
            <Ionicons name='checkmark-circle' size={20} color='#000' />
            <Text style={styles.checkInButtonText}>Check In</Text>
          </TouchableOpacity>
        )}
      </Card>
    </TouchableOpacity>
  );
}

function getPermitLabel(permitCode: string): string {
  const permitMap: { [key: string]: string } = {
    'S': 'Commuter',
    'R': 'Resident',
    'E': 'Staff',
    'V': 'Visitor',
  };
  return permitMap[permitCode] || permitCode;
}

function getFeatureIcon(feature: string): any {
  const iconMap: { [key: string]: any } = {
    'covered': 'umbrella',
    'ev-charging': 'flash',
    'security-cameras': 'videocam',
    '24-7-access': 'time',
    'well-lit': 'sunny',
    'shuttle-access': 'bus',
    'bike-racks': 'bicycle',
    'reserved-spots': 'bookmark',
    'pay-station': 'card',
  };
  return iconMap[feature] || 'checkmark-circle';
}

function formatFeature(feature: string): string {
  return feature
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.base,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  titleContainer: {
    flex: 1,
  },
  name: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  type: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
    gap: 4,
  },
  distanceText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textSecondary,
  },
  availability: {
    marginBottom: SPACING.base,
  },
  availabilityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.sm,
  },
  availabilityText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    marginRight: SPACING.sm,
  },
  occupancyText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: BORDER_RADIUS.xs,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: BORDER_RADIUS.xs,
  },
  percentageText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textSecondary,
    width: 36,
    textAlign: 'right',
  },
  permits: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  permitsLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginRight: SPACING.sm,
    marginTop: 4,
  },
  permitBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
    gap: 6,
  },
  permitBadge: {
    backgroundColor: `${COLORS.primary}20`,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.xs,
    minWidth: 70,
    alignItems: 'center',
  },
  permitText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.primary,
  },
  features: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  featureText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
  },
  checkInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.base,
    gap: SPACING.sm,
  },
  checkInButtonText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: '#000',
  },
});
