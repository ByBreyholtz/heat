import React from "react";
import MapView from "react-native-maps";

export default function CleanMapbox() {
  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: 40.7128,
        longitude: -74.006,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
      mapType="standard"
    />
  );
}
