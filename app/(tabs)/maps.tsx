import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function MapsScreen() {
  const colorScheme = useColorScheme();
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState<Region>({
    latitude: 40.7128,
    longitude: -74.006,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [isPositionActive, setIsPositionActive] = useState(false);
  const [targetPosition, setTargetPosition] = useState<Region | null>(null);

  // Sample sauna locations
  const saunaLocations = [
    {
      id: "1",
      title: "Nordic Sauna Co. - Main Office",
      coordinate: { latitude: 40.7128, longitude: -74.006 },
      description: "Our main showroom and office",
    },
    {
      id: "2",
      title: "Nordic Sauna Co. - Brooklyn",
      coordinate: { latitude: 40.6782, longitude: -73.9442 },
      description: "Brooklyn showroom",
    },
    {
      id: "3",
      title: "Nordic Sauna Co. - Queens",
      coordinate: { latitude: 40.7282, longitude: -73.7949 },
      description: "Queens installation center",
    },
  ];

  const handleMarkerPress = (location: any) => {
    Alert.alert(location.title, location.description, [
      {
        text: "Get Directions",
        onPress: () => {
          Alert.alert("Directions", "Opening directions to " + location.title);
        },
      },
      { text: "Close", style: "cancel" },
    ]);
  };

  const centerOnLocation = (location: any) => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: location.coordinate.latitude,
          longitude: location.coordinate.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );
    }
  };

  const handleDateGuestsPress = () => {
    Alert.alert(
      "Date & Guests",
      "This would open a date picker and guest selector",
      [{ text: "OK" }]
    );
  };

  const handleFilterPress = () => {
    Alert.alert(
      "Filters",
      "This would open filter options for sauna types, amenities, etc.",
      [{ text: "OK" }]
    );
  };

  const handlePositionPress = () => {
    // Set target position and activate
    const newTargetPosition = {
      latitude: 40.7128,
      longitude: -74.006,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };

    setTargetPosition(newTargetPosition);
    setIsPositionActive(true);

    // Center the map on user's current location
    // This would typically use geolocation to get current position
    // For now, we'll center on a default location
    if (mapRef.current) {
      mapRef.current.animateToRegion(newTargetPosition, 1000);
    }
  };

  // Check if user is at the target position
  const isAtTargetPosition = () => {
    if (!targetPosition || !isPositionActive) return false;

    const latDiff = Math.abs(region.latitude - targetPosition.latitude);
    const lngDiff = Math.abs(region.longitude - targetPosition.longitude);
    const latDelta = region.latitudeDelta;
    const lngDelta = region.longitudeDelta;

    // Consider "at position" if within the current zoom level's delta
    return latDiff < latDelta * 0.3 && lngDiff < lngDelta * 0.3;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ThemedView style={styles.container}>
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            style={styles.map}
            region={region}
            onRegionChangeComplete={setRegion}
            showsUserLocation={true}
            showsMyLocationButton={true}
            showsCompass={true}
            showsScale={true}
          >
            {saunaLocations.map((location) => (
              <Marker
                key={location.id}
                coordinate={location.coordinate}
                title={location.title}
                description={location.description}
                onPress={() => handleMarkerPress(location)}
              />
            ))}
          </MapView>
        </View>

        {/* Position Button in Top Right */}
        <TouchableOpacity
          style={styles.positionButton}
          onPress={handlePositionPress}
        >
          <Ionicons
            name={
              isAtTargetPosition()
                ? "checkmark-circle"
                : isPositionActive
                ? "locate"
                : "locate-outline"
            }
            size={28}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        {/* Floating Button in Bottom Center */}
        <View style={styles.floatingButtonContainer}>
          <TouchableOpacity
            style={styles.floatingButton}
            onPress={handleDateGuestsPress}
          >
            <View style={styles.buttonContent}>
              <ThemedText style={styles.floatingButtonText}>
                {formatDate(selectedDate)}
              </ThemedText>
              <View style={styles.iconContainer}>
                <Ionicons name="person" size={16} color="#333" />
                <View style={styles.guestIndicator}>
                  <ThemedText style={styles.guestIndicatorText}>
                    {numberOfGuests}
                  </ThemedText>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.filterButton}
            onPress={handleFilterPress}
          >
            <ThemedText style={styles.filterButtonText}>Filters</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  positionButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#1F2937", // Same as tab background
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  floatingButtonContainer: {
    position: "absolute",
    bottom: 120,
    alignSelf: "center",
    flexDirection: "row",
    width: 220,
  },
  floatingButton: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    alignItems: "center",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  floatingButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  guestIndicator: {
    justifyContent: "center",
    alignItems: "center",
  },
  guestIndicatorText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  filterButton: {
    flex: 1,
    backgroundColor: "#8B4513",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    alignItems: "center",
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
  },
});
