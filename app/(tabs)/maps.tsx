import React from "react";
import { Alert, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Location {
  id: string;
  title: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  description: string;
}

export default function MapsScreen() {
  // Sample sauna locations
  const saunaLocations: Location[] = [
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

  const handleLocationPress = (location: Location) => {
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

  const handleMapPress = (coordinate: {
    latitude: number;
    longitude: number;
  }) => {
    Alert.alert(
      "Map Pressed",
      `Coordinates: ${coordinate.latitude.toFixed(
        4
      )}, ${coordinate.longitude.toFixed(4)}`,
      [{ text: "OK" }]
    );
  };

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top", "left", "right"]}
    ></SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
});
