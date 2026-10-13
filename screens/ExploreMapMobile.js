import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView, ActivityIndicator, Text } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";
import { fetchListings } from "../utils/api";
import { useTheme } from "../context/ThemeContext";

export default function ExploreMapMobile() {
  const { colors } = useTheme();
  const mapRef = useRef(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      await Location.requestForegroundPermissionsAsync();
      const list = await fetchListings(1, { per_page: 1000 });
      setListings(list.filter(l => l.latitude && l.longitude));
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color={colors.primary} />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        provider="google"
        initialRegion={{
          latitude: 20.5937,
          longitude: 78.9629,
          latitudeDelta: 6,
          longitudeDelta: 6,
        }}
        showsUserLocation
      >
        {listings.map(item => (
          <Marker
            key={item.id}
            coordinate={{
              latitude: Number(item.latitude),
              longitude: Number(item.longitude),
            }}
          />
        ))}
      </MapView>
    </SafeAreaView>
  );
}
