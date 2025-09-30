import CustomTabBar from "@/components/ui/custom-tab-bar";
import { Colors } from "@/constants/theme";
import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function TabLayout() {
  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          headerShown: false,
        }}
        tabBar={() => <CustomTabBar />}
      >
        <Tabs.Screen name="maps" />
        <Tabs.Screen name="index" />
        <Tabs.Screen name="favorites" />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
});
