import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  Pressable,
} from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";
import { getListingsWithVillages } from "../utils/api";
import { useTheme } from "../context/ThemeContext";

export default function ExploreScreen() {
  const { colors } = useTheme();
  const mapRef = useRef(null);

  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🇮🇳 Safe India fallback
  const fallbackRegion = {
    latitude: 20.5937,
    longitude: 78.9629,
    latitudeDelta: 6,
    longitudeDelta: 6,
  };

  useEffect(() => {
    loadMapData();
  }, []);

  async function loadMapData() {
    try {
      await Location.requestForegroundPermissionsAsync();

      const data = await getListingsWithVillages();

      // ✅ Normalize + validate coords
      const resolved = data
        .map(item => ({
          ...item,
          latitude: Number(item.latitude),
          longitude: Number(item.longitude),
        }))
        .filter(
          item =>
            Number.isFinite(item.latitude) &&
            Number.isFinite(item.longitude)
        );

      if (!resolved.length) {
        Alert.alert("Map Info", "No business locations found");
        setLoading(false);
        return;
      }

      setPoints(resolved);

      // 🎯 Auto zoom
      setTimeout(() => {
        mapRef.current?.fitToCoordinates(
          resolved.map(p => ({
            latitude: p.latitude,
            longitude: p.longitude,
          })),
          {
            edgePadding: { top: 80, bottom: 80, left: 80, right: 80 },
            animated: true,
          }
        );
      }, 600);
    } catch (e) {
      Alert.alert("Map Error", e.message || "Failed to load map");
    } finally {
      setLoading(false);
    }
  }

  // 🚀 Open REAL business location in Google Maps
  function openInGoogleMaps(item) {
    const { latitude, longitude, business_name } = item;

    const url = Platform.select({
      android: `geo:${latitude},${longitude}?q=${latitude},${longitude}(${encodeURIComponent(
        business_name
      )})`,
      ios: `http://maps.apple.com/?ll=${latitude},${longitude}&q=${encodeURIComponent(
        business_name
      )}`,
    });

    Linking.openURL(url);
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={fallbackRegion}
        showsUserLocation
        showsMyLocationButton
      >
        {points.map(item => (
          <Marker
            key={item.listing_id}
            coordinate={{
              latitude: item.latitude,
              longitude: item.longitude,
            }}
          >
            {/* ✅ ANDROID SAFE CALLOUT CLICK */}
            <Callout tooltip>
              <Pressable
                onPress={() => openInGoogleMaps(item)}
                style={styles.callout}
              >
                <Text style={styles.title}>{item.business_name}</Text>
                <Text style={styles.address}>{item.village_name}</Text>
                <Text style={styles.link}>Open in Google Maps →</Text>
              </Pressable>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loader: {
    position: "absolute",
    top: 20,
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
    padding: 10,
    borderRadius: 10,
    elevation: 4,
  },
  callout: {
    width: 220,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    elevation: 6,
  },
  title: {
    fontWeight: "700",
    fontSize: 14,
  },
  address: {
    fontSize: 12,
    marginTop: 4,
    color: "#555",
  },
  link: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "600",
    color: "#1a73e8",
  },
});
