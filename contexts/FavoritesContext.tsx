import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface Property {
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
  type: ("popular" | "felles" | "privat")[];
}

interface FavoritesContextType {
  favoritedProperties: Set<string>;
  favoriteProperties: Property[];
  toggleFavorite: (property: Property) => Promise<void>;
  isFavorited: (propertyId: string) => boolean;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

const FAVORITES_STORAGE_KEY = "favorited_properties";
const PROPERTIES_STORAGE_KEY = "favorite_properties_data";

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [favoritedProperties, setFavoritedProperties] = useState<Set<string>>(
    new Set()
  );
  const [favoriteProperties, setFavoriteProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Load favorites from storage on app start
  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const [favoritedIds, propertiesData] = await Promise.all([
        AsyncStorage.getItem(FAVORITES_STORAGE_KEY),
        AsyncStorage.getItem(PROPERTIES_STORAGE_KEY),
      ]);

      if (favoritedIds) {
        const ids = JSON.parse(favoritedIds);
        setFavoritedProperties(new Set(ids));
      }

      if (propertiesData) {
        const properties = JSON.parse(propertiesData);
        setFavoriteProperties(properties);
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveFavorites = async (ids: string[], properties: Property[]) => {
    try {
      await Promise.all([
        AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(ids)),
        AsyncStorage.setItem(
          PROPERTIES_STORAGE_KEY,
          JSON.stringify(properties)
        ),
      ]);
    } catch (error) {
      console.error("Error saving favorites:", error);
    }
  };

  const toggleFavorite = async (property: Property) => {
    try {
      const newFavoritedProperties = new Set(favoritedProperties);
      let newFavoriteProperties = [...favoriteProperties];

      if (newFavoritedProperties.has(property.id)) {
        // Remove from favorites
        newFavoritedProperties.delete(property.id);
        newFavoriteProperties = newFavoriteProperties.filter(
          (p) => p.id !== property.id
        );
      } else {
        // Add to favorites
        newFavoritedProperties.add(property.id);
        newFavoriteProperties.push(property);
      }

      setFavoritedProperties(newFavoritedProperties);
      setFavoriteProperties(newFavoriteProperties);

      // Save to storage
      await saveFavorites(
        Array.from(newFavoritedProperties),
        newFavoriteProperties
      );
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const isFavorited = (propertyId: string) => {
    return favoritedProperties.has(propertyId);
  };

  const value: FavoritesContextType = {
    favoritedProperties,
    favoriteProperties,
    toggleFavorite,
    isFavorited,
    loading,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
