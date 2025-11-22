import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Dimensions, Linking, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { USF_PARKING_LOTS, ParkingLocation } from '../../constants/parkingLocations';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS, OPACITY } from '../../constants/theme';
import { SharedElement } from 'react-navigation-shared-element';

type MapScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Map'>;
type MapScreenRouteProp = RouteProp<RootStackParamList, 'Map'>;

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_HEIGHT = 220;

export default function MapScreen() {
  const navigation = useNavigation<MapScreenNavigationProp>();
  const route = useRoute<MapScreenRouteProp>();
  const mapRef = useRef<MapView>(null);
  const [selectedParking, setSelectedParking] = useState<ParkingLocation | null>(null);

  useEffect(() => {
    const { latitude, longitude } = route.params || {};
    if (latitude && longitude) {
      mapRef.current?.animateToRegion(
        {
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );
    }
  }, [route.params]);

  const handleMarkerPress = (parking: ParkingLocation) => {
    setSelectedParking(parking);
    mapRef.current?.animateToRegion({
      latitude: parking.coordinates.latitude,
      longitude: parking.coordinates.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }, 500);
  };

  const handleCenterOnUser = () => {
    // Center on USF campus
    mapRef.current?.animateToRegion({
      latitude: 28.0587,
      longitude: -82.4139,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    }, 500);
  };

  const openNativeMaps = (parking: ParkingLocation) => {
    const { latitude, longitude } = parking.coordinates;
    const label = parking.shortName;
    
    const scheme = Platform.select({
      ios: 'maps://0,0?q=',
      android: 'geo:0,0?q='
    });
    const latLng = `${latitude},${longitude}`;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });

    if (url) {
      Linking.openURL(url);
    }
  };

  // Generate stable occupancy data that doesn't change on re-renders
  const parkingOccupancy = React.useMemo(() => {
    const occupancyMap = new Map<string, { percentage: number; color: string }>();
    
    USF_PARKING_LOTS.forEach((parking) => {
      const totalCapacity = Object.values(parking.capacity).reduce((a, b) => a + b, 0);
      const occupied = Math.floor(Math.random() * totalCapacity);
      const percentage = (occupied / totalCapacity) * 100;
      
      let color;
      if (percentage < 60) color = COLORS.success;
      else if (percentage < 85) color = COLORS.warning;
      else color = COLORS.error;
      
      occupancyMap.set(parking.id, { percentage, color });
    });
    
    return occupancyMap;
  }, []); // Empty dependency array means this only runs once

  const getMarkerColor = (parking: ParkingLocation) => {
    return parkingOccupancy.get(parking.id)?.color || COLORS.success;
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    // Haversine formula to calculate distance in meters
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  const handleCheckIn = async (parking: ParkingLocation) => {
    try {
      // Request location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission Required',
          'Please enable location services to check in to parking lots.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const userLat = location.coords.latitude;
      const userLon = location.coords.longitude;
      const parkingLat = parking.coordinates.latitude;
      const parkingLon = parking.coordinates.longitude;

      // Calculate distance in meters
      const distance = calculateDistance(userLat, userLon, parkingLat, parkingLon);
      
      // If user is more than 100 meters away, show confirmation
      if (distance > 100) {
        Alert.alert(
          'Location Check',
          `This parking lot seems far away from your current location (${Math.round(distance)}m away). Would you still like to check in?`,
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Check In Anyway',
              onPress: () => navigateToCheckIn(parking),
            },
          ]
        );
      } else {
        // User is close enough, proceed with check-in
        navigateToCheckIn(parking);
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert(
        'Location Error',
        'Unable to get your current location. Would you like to check in anyway?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Check In Anyway',
            onPress: () => navigateToCheckIn(parking),
          },
        ]
      );
    }
  };

  const navigateToCheckIn = (parking: ParkingLocation) => {
    navigation.navigate('CheckIn', {
      parkingId: parking.id,
      parkingName: parking.shortName,
      parkingType: parking.type,
      floors: parking.floors,
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle='light-content' />

      <SharedElement id="map" style={StyleSheet.absoluteFill}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_DEFAULT}
          userInterfaceStyle="dark"
          initialRegion={{
            latitude: 28.0587,
            longitude: -82.4139,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
          showsUserLocation
          showsMyLocationButton={false}
        >
          {USF_PARKING_LOTS.map((parking) => (
            <Marker
              key={parking.id}
              coordinate={parking.coordinates}
              onPress={() => handleMarkerPress(parking)}
              tracksViewChanges={false}
            >
              <View
                style={[
                  styles.marker,
                  { backgroundColor: getMarkerColor(parking) }
                ]}
              >
                <Ionicons
                  name={parking.type === 'garage' ? 'business' : 'car'}
                  size={24}
                  color='#FFF'
                />
              </View>
            </Marker>
          ))}
        </MapView>
      </SharedElement>

      {/* Header Controls */}
      <SafeAreaView style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
            activeOpacity={OPACITY.pressed}
          >
            <Ionicons name='chevron-back' size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleCenterOnUser}
            activeOpacity={OPACITY.pressed}
          >
            <Ionicons name='locate' size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Bottom Card */}
      {selectedParking ? (
        <View style={styles.bottomCard}>
          <Card variant="elevated" padding="lg">
            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedParking(null)}
              activeOpacity={OPACITY.pressed}
            >
              <Ionicons name='close' size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>

            {/* Header */}
            <View style={styles.cardHeader}>
              <View style={styles.parkingIconContainer}>
                <Ionicons
                  name={selectedParking.type === 'garage' ? 'business' : 'car'}
                  size={24}
                  color={COLORS.primary}
                />
              </View>
              <View style={styles.cardTitleContainer}>
                <Text style={styles.cardTitle}>{selectedParking.shortName}</Text>
                <Text style={styles.cardSubtitle}>
                  {selectedParking.type === 'garage'
                    ? `${selectedParking.floors} Floors`
                    : 'Surface Lot'}
                </Text>
              </View>
            </View>

            {/* Availability */}
            <View style={styles.availabilityContainer}>
              <View style={styles.availabilityBadge}>
                <Ionicons name='checkmark-circle' size={18} color={COLORS.success} />
                <Text style={styles.availabilityText}>Available</Text>
              </View>
              <Text style={styles.spotsText}>
                {Math.floor(Math.random() * 50) + 10} spots open
              </Text>
            </View>

            {/* Info */}
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Ionicons name='walk' size={18} color={COLORS.textSecondary} />
                <Text style={styles.infoText}>
                  {Math.floor(Math.random() * 10) + 2} min walk
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name='pricetag' size={18} color={COLORS.textSecondary} />
                <Text style={styles.infoText}>
                  {selectedParking.permits.join(', ')}
                </Text>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.cardActions}>
              <TouchableOpacity
                style={styles.actionButtonSecondary}
                activeOpacity={OPACITY.pressed}
                onPress={() => openNativeMaps(selectedParking)}
              >
                <Ionicons name='navigate' size={22} color={COLORS.textPrimary} />
                <Text style={styles.actionTextSecondary}>Directions</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButtonPrimary}
                activeOpacity={OPACITY.pressed}
                onPress={() => handleCheckIn(selectedParking)}
              >
                <Ionicons name='checkmark-circle' size={22} color='#000' />
                <Text style={styles.actionTextPrimary}>Check In</Text>
              </TouchableOpacity>
            </View>
          </Card>
        </View>
      ) : (
        <View style={styles.bottomPrompt}>
          <Card variant="elevated" padding="md">
            <View style={styles.promptContent}>
              <Ionicons name='map' size={24} color={COLORS.primary} />
              <Text style={styles.promptText}>Tap a marker to see details</Text>
            </View>
          </Card>
        </View>
      )}

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.success }]} />
          <Text style={styles.legendText}>Available</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.warning }]} />
          <Text style={styles.legendText}>Limited</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.error }]} />
          <Text style={styles.legendText}>Full</Text>
        </View>
      </View>
    </View>
  );
}

MapScreen.sharedElements = (route: any, otherRoute: any, showing: any) => {
  return [{
    id: 'map',
    animation: 'move',
  }];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  marker: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#FFF',
    ...SHADOWS.large,
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  bottomCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: SPACING.base,
    paddingBottom: SPACING.lg,
  },
  closeButton: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    zIndex: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.base,
  },
  parkingIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: `${COLORS.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  cardSubtitle: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.base,
  },
  availabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  availabilityText: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.success,
  },
  spotsText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  infoRow: {
    flexDirection: 'row',
    gap: SPACING.lg,
    marginBottom: SPACING.base,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textPrimary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  cardActions: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.sm,
  },
  actionButtonSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surfaceLight,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.button,
    gap: SPACING.sm,
  },
  actionTextSecondary: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textPrimary,
  },
  actionButtonPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.base,
    borderRadius: BORDER_RADIUS.button,
    gap: SPACING.sm,
  },
  actionTextPrimary: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: '#000',
  },
  bottomPrompt: {
    position: 'absolute',
    bottom: SPACING.lg,
    left: SPACING.base,
    right: SPACING.base,
  },
  promptContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.sm,
  },
  promptText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textSecondary,
  },
  legend: {
    position: 'absolute',
    top: 100,
    right: SPACING.base,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    gap: SPACING.xs,
    ...SHADOWS.medium,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textPrimary,
  },
});