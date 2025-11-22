import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { USF_PARKING_LOTS } from '../../../constants/parkingLocations';
import { COLORS } from '../../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type MapWidgetNavigationProp = StackNavigationProp<RootStackParamList, 'Map'>;

const MapWidget = () => {
  const navigation = useNavigation<MapWidgetNavigationProp>();

  return (
    <TouchableOpacity onPress={() => navigation.navigate('Map', {})}>
      <View style={styles.container}>
        <MapView
          key="usf-campus-map"
          provider={PROVIDER_DEFAULT}
          style={styles.map}
          userInterfaceStyle="dark"
          initialRegion={{
            latitude: 28.0587,
            longitude: -82.4139,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
          scrollEnabled={false}
          zoomEnabled={false}
          pitchEnabled={false}
          rotateEnabled={false}
        >
          {USF_PARKING_LOTS.map((parking) => (
            <Marker key={parking.id} coordinate={parking.coordinates}>
              <View style={[styles.marker, { backgroundColor: COLORS.primary }]}>
                <Ionicons
                  name={parking.type === 'garage' ? 'business' : 'car'}
                  size={12}
                  color='#FFF'
                />
              </View>
            </Marker>
          ))}
        </MapView>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 150,
    borderRadius: 10,
    overflow: 'hidden',
    margin: 10,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  marker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
});

export default MapWidget;
