// App mínima amb React Native per mesurar distància i temps amb GPS + mapa

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { LogBox } from 'react-native';
import { Dimensions } from 'react-native';

LogBox.ignoreAllLogs(); // o filtra logs específics si vols afinar més
const { height } = Dimensions.get('window');
const HEADER_HEIGHT = height * 0.35;


const haversine = (coord1, coord2) => {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371e3;
  const φ1 = toRad(coord1.latitude);
  const φ2 = toRad(coord2.latitude);
  const Δφ = toRad(coord2.latitude - coord1.latitude);
  const Δλ = toRad(coord2.longitude - coord1.longitude);

  const a = Math.sin(Δφ / 2) ** 2 +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function App() {
  const [tracking, setTracking] = useState(false);
  const [distance, setDistance] = useState(0);
  const [time, setTime] = useState(0);
  const [positions, setPositions] = useState([]);
  const watchId = useRef(null);
  const timer = useRef(null);

  useEffect(() => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    }
  }, []);

  const startTracking = () => {
    setTracking(true);
    setDistance(0);
    setTime(0);
    setPositions([]);

    let lastPosition = null;
    watchId.current = Geolocation.watchPosition(
      (pos) => {
        const newPosition = pos.coords;
        if (lastPosition) {
          const d = haversine(lastPosition, newPosition);
          setDistance((prev) => prev + d);
        }
        lastPosition = newPosition;
        setPositions((prev) => [...prev, newPosition]);
      },
      (error) => console.warn(error.message),
      { enableHighAccuracy: true, distanceFilter: 1, interval: 1000 }
    );

    timer.current = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);
  };

  const stopTracking = () => {
    setTracking(false);
    if (watchId.current !== null) Geolocation.clearWatch(watchId.current);
    clearInterval(timer.current);
  };

  const lastPos = positions[positions.length - 1];

  return (
    <View style={styles.container}>
      <View style={styles.dataContainer}>
        <View style={styles.statsCard}>
          <Text style={styles.label}>Distància: {distance.toFixed(1)} m</Text>
          <Text style={styles.label}>Temps: {Math.floor(time / 60)} min {time % 60} s</Text>
          <TouchableOpacity
            style={[styles.button, tracking && styles.buttonStop]}
            onPress={tracking ? stopTracking : startTracking}
          >
            <Text style={styles.buttonText}>{tracking ? 'Atura' : 'Inicia'}</Text>
          </TouchableOpacity>
        </View>
      </View>
  
      <MapView
        style={styles.map}
        region={{
          latitude: lastPos ? lastPos.latitude : 41.98,
          longitude: lastPos ? lastPos.longitude : 2.82,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        showsUserLocation={true}
      >
        {positions.length > 0 && (
          <>
            <Polyline coordinates={positions} strokeColor="#2196F3" strokeWidth={4} />
            <Marker coordinate={lastPos} title="Ara aquí" />
          </>
        )}
      </MapView>
    </View>
  );  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  dataContainer: {
    height: HEADER_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  statsCard: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    alignItems: 'center',
  },
  label: {
    fontSize: 20,
    fontWeight: '500',
    color: '#333',
    marginVertical: 6,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
  },
  buttonStop: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  map: {
    flex: 1,
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
});

