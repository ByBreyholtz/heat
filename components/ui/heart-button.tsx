import { useFavorites } from "@/contexts/FavoritesContext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

interface HeartButtonProps {
  property: {
    id: string;
    title: string;
    rating: number;
    reviews: number;
    capacity: number;
    temperature: string;
    duration: string;
    features: string;
    description: string;
    facilities: string[];
    originalPrice: number;
    currentPrice: number;
    image: string;
    tags?: string[];
    location?: string;
    type: ("popular" | "felles" | "privat")[];
  };
  style?: any;
  onPress?: () => void;
  size?: "small" | "medium" | "large";
  variant?: "card" | "drawer" | "favorites";
}

const HeartButton: React.FC<HeartButtonProps> = ({
  property,
  style,
  onPress,
  size = "medium",
  variant = "card",
}) => {
  const { isFavorited, toggleFavorite } = useFavorites();

  const handlePress = async () => {
    try {
      await toggleFavorite(property);
      onPress?.();
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const getSizeConfig = () => {
    switch (size) {
      case "small":
        return { iconSize: 14, buttonSize: 32 };
      case "medium":
        return { iconSize: 18, buttonSize: 40 };
      case "large":
        return { iconSize: 24, buttonSize: 50 };
      default:
        return { iconSize: 18, buttonSize: 40 };
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "card":
        return {
          container: styles.cardContainer,
          active: styles.cardActive,
          iconColor: isFavorited(property.id) ? "#FFFFFF" : "#FF6B6B",
        };
      case "drawer":
        return {
          container: styles.drawerContainer,
          active: styles.drawerActive,
          iconColor: isFavorited(property.id) ? "#FFFFFF" : "#FF6B6B",
        };
      case "favorites":
        return {
          container: styles.favoritesContainer,
          active: styles.favoritesActive,
          iconColor: isFavorited(property.id) ? "#FFFFFF" : "#FF6B6B",
        };
      default:
        return {
          container: styles.cardContainer,
          active: styles.cardActive,
          iconColor: isFavorited(property.id) ? "#FFFFFF" : "#FF6B6B",
        };
    }
  };

  const { iconSize, buttonSize } = getSizeConfig();
  const { container, active, iconColor } = getVariantStyles();

  return (
    <TouchableOpacity
      style={[
        container,
        {
          width: buttonSize,
          height: buttonSize,
        },
        isFavorited(property.id) && active,
        style,
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Ionicons
        name={isFavorited(property.id) ? "heart" : "heart-outline"}
        size={iconSize}
        color={iconColor}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Card variant styles
  cardContainer: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardActive: {
    backgroundColor: "#FF6B6B",
  },

  // Drawer variant styles
  drawerContainer: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  drawerActive: {
    backgroundColor: "#FF6B6B",
  },

  // Favorites variant styles
  favoritesContainer: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 20,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  favoritesActive: {
    backgroundColor: "rgba(255, 107, 107, 0.9)",
  },
});

export default HeartButton;
