import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { usePathname, useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

interface TabItem {
  name: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const tabs: TabItem[] = [
  { name: "maps", title: "Maps", icon: "map-outline" },
  { name: "index", title: "Discover", icon: "compass-outline" },
  { name: "favorites", title: "Favorites", icon: "heart-outline" },
];

export default function CustomTabBar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleTabPress = (tabName: string) => {
    // Add haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Navigate to the tab
    if (tabName === "index") {
      router.push("/");
    } else {
      router.push(`/(tabs)/${tabName}` as any);
    }
  };

  const isActive = (tabName: string) => {
    if (tabName === "index") {
      return pathname === "/" || pathname === "/index";
    }
    return pathname === `/(tabs)/${tabName}` || pathname === `/${tabName}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.name}
            style={styles.tabItem}
            onPress={() => handleTabPress(tab.name)}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Ionicons
                name={tab.icon}
                size={24}
                color={isActive(tab.name) ? "#FFFFFF" : "#9CA3AF"}
              />
            </View>
            <Text
              style={[
                styles.tabLabel,
                { color: isActive(tab.name) ? "#FFFFFF" : "#9CA3AF" },
              ]}
            >
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#1F2937", // Dark gray background
    borderRadius: 25,
    paddingHorizontal: 8,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  iconContainer: {
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
});
