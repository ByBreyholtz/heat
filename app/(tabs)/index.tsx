import HeartButton from "@/components/ui/heart-button";
import PropertyDrawer from "@/components/ui/property-drawer";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Location from "expo-location";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

const { width, height } = Dimensions.get("window");

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
  images: string[];
  tags: string[];
  location: string;
  type: ("popular" | "felles" | "privat")[];
  affiliateCode?: string;
  hasDiscount: boolean;
}

export default function HomeScreen() {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [webViewVisible, setWebViewVisible] = useState(false);
  const [webViewProperty, setWebViewProperty] = useState<Property | null>(null);
  const [location, setLocation] = useState<string>("Norway");
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [activeTab, setActiveTab] = useState<"popular" | "felles" | "privat">(
    "popular"
  );
  const webViewTranslateY = useRef(new Animated.Value(height)).current;

  const saunas: Property[] = [
    {
      id: "1",
      title: "Kjøkkelvik Sauna - Vestfjord Sauna",
      rating: 4.98,
      reviews: 234,
      capacity: 6,
      temperature: "80-90°C",
      duration: "1.5 timer",
      features: "Wood-fired, Lake view",
      description:
        "En autentisk vedfyrt sauna med spektakulær utsikt over Vestfjorden. Perfekt for romantiske par eller små grupper som ønsker en tradisjonell norsk saunaopplevelse.",
      facilities: [
        "Vedfyrt ovn",
        "Fjordutsikt",
        "Isbad",
        "Dusj",
        "Håndklær",
        "Siteputer",
        "Vannkoker",
      ],
      originalPrice: 199,
      currentPrice: 99,
      image:
        "https://vestfjordsauna.no/_next/image?url=%2Fimg%2Fkjokkelvik%2Fkjokkelvik-sauna.jpg&w=828&q=75",
      images: [
        "https://vestfjordsauna.no/_next/image?url=%2Fimg%2Fkjokkelvik%2Fkjokkelvik-sauna.jpg&w=828&q=75",
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1506905925346-14b1e3d7e9b9?w=800&h=600&fit=crop",
      ],
      tags: ["vedfyrt", "utsikt", "fjord", "tradisjonell", "romantisk"],
      location: "Kjøkkelvik",
      type: ["popular", "felles"],
      affiliateCode: "KJOKKEL20",
      hasDiscount: true,
    },
    {
      id: "2",
      title: "Grimen Sauna - Vestfjord Sauna",
      rating: 4.95,
      reviews: 189,
      capacity: 4,
      temperature: "85-95°C",
      duration: "1.5 hours",
      features: "Electric, Fjord view",
      description:
        "Moderne elektrisk sauna med panoramautsikt over fjorden. Ideell for familier og grupper som ønsker komfort og enkelhet med likevel fantastisk utsikt.",
      facilities: [
        "Elektrisk ovn",
        "Fjordutsikt",
        "Dusj",
        "Håndklær",
        "Siteputer",
        "Vannkoker",
        "Ventilasjon",
      ],
      originalPrice: 450,
      currentPrice: 450,
      image:
        "https://vestfjordsauna.no/_next/image?url=%2Fimg%2Fgrimen%2Fgrimen-sauna.jpg&w=828&q=75",
      images: [
        "https://vestfjordsauna.no/_next/image?url=%2Fimg%2Fgrimen%2Fgrimen-sauna.jpg&w=828&q=75",
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1506905925346-14b1e3d7e9b9?w=800&h=600&fit=crop",
      ],
      tags: ["elektrisk", "fjord", "moderne", "familie", "tilgjengelig"],
      location: "Grimen",
      type: ["felles"],
      hasDiscount: false,
    },
    {
      id: "3",
      title: "Husnes Sauna - Vestfjord Sauna",
      rating: 4.92,
      reviews: 156,
      capacity: 8,
      temperature: "75-85°C",
      duration: "3 hours",
      features: "Northern Lights view, Ice plunge",
      description:
        "Eksklusiv privat sauna med mulighet for å se nordlys. Inkluderer isbad og unik opplevelse under nordlys. Perfekt for spesielle anledninger og private grupper.",
      facilities: [
        "Vedfyrt ovn",
        "Nordlysutsikt",
        "Isbad",
        "Privat område",
        "Dusj",
        "Håndklær",
        "Siteputer",
        "Vannkoker",
        "Oppvarming",
      ],
      originalPrice: 680,
      currentPrice: 580,
      image:
        "https://vestfjordsauna.no/_next/image?url=%2Fimg%2Fhusnes%2Fhusnes-sauna.jpg&w=828&q=75",
      images: [
        "https://vestfjordsauna.no/_next/image?url=%2Fimg%2Fhusnes%2Fhusnes-sauna.jpg&w=828&q=75",
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1506905925346-14b1e3d7e9b9?w=800&h=600&fit=crop",
      ],
      tags: ["nordlys", "isbad", "gruppe", "vinter", "eventyr"],
      location: "Husnes",
      type: ["privat", "popular"],
      affiliateCode: "HUSNES15",
      hasDiscount: true,
    },
    {
      id: "4",
      title: "Lofoten Sauna - Arctic Experience",
      rating: 4.88,
      reviews: 203,
      capacity: 6,
      temperature: "80-90°C",
      duration: "2 hours",
      features: "Mountain view, Traditional wood-fired",
      description:
        "Tradisjonell vedfyrt sauna i hjertet av Lofoten med spektakulær fjellutsikt. En autentisk arktisk opplevelse som kombinerer norsk saunakultur med Lofotens unike landskap.",
      facilities: [
        "Vedfyrt ovn",
        "Fjellutsikt",
        "Tradisjonell design",
        "Dusj",
        "Håndklær",
        "Siteputer",
        "Vannkoker",
        "Ved",
      ],
      originalPrice: 450,
      currentPrice: 380,
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1506905925346-14b1e3d7e9b9?w=800&h=600&fit=crop",
        "https://vestfjordsauna.no/_next/image?url=%2Fimg%2Fkjokkelvik%2Fkjokkelvik-sauna.jpg&w=828&q=75",
      ],
      tags: ["fjell", "tradisjonell", "vedfyrt", "lofoten", "arktisk"],
      location: "Lofoten",
      type: ["popular", "felles"],
      affiliateCode: "LOFOTEN25",
      hasDiscount: true,
    },
    {
      id: "5",
      title: "Bergen Fjord Sauna - Urban Escape",
      rating: 4.75,
      reviews: 142,
      capacity: 4,
      temperature: "85-95°C",
      duration: "1.5 hours",
      features: "Fjord view, Modern design",
      description:
        "Moderne sauna i Bergen sentrum med utsikt over fjorden. Perfekt for bygående som ønsker en rask saunaopplevelse uten å forlate byen.",
      facilities: [
        "Elektrisk ovn",
        "Fjordutsikt",
        "Moderne design",
        "Dusj",
        "Håndklær",
        "Siteputer",
        "Vannkoker",
        "Ventilasjon",
        "Parkering",
      ],
      originalPrice: 280,
      currentPrice: 280,
      image:
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1506905925346-14b1e3d7e9b9?w=800&h=600&fit=crop",
        "https://vestfjordsauna.no/_next/image?url=%2Fimg%2Fgrimen%2Fgrimen-sauna.jpg&w=828&q=75",
      ],
      tags: ["fjord", "moderne", "urban", "elektrisk", "tilgjengelig"],
      location: "Bergen",
      type: ["felles"],
      hasDiscount: false,
    },
    {
      id: "6",
      title: "Tromsø Aurora Sauna - Northern Magic",
      rating: 4.95,
      reviews: 178,
      capacity: 8,
      temperature: "75-85°C",
      duration: "2.5 hours",
      features: "Aurora viewing, Ice bath, Hot tub",
      description:
        "Premium sauna-opplevelse i Tromsø med mulighet for nordlys, isbad og boblebad. Den ultimate arktiske saunaopplevelsen for de som ønsker det beste.",
      facilities: [
        "Vedfyrt ovn",
        "Nordlysutsikt",
        "Isbad",
        "Boblebad",
        "Privat område",
        "Dusj",
        "Håndklær",
        "Siteputer",
        "Vannkoker",
        "Oppvarming",
        "Snacks",
      ],
      originalPrice: 750,
      currentPrice: 650,
      image:
        "https://images.unsplash.com/photo-1506905925346-14b1e3d7e9b9?w=800&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1506905925346-14b1e3d7e9b9?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
        "https://vestfjordsauna.no/_next/image?url=%2Fimg%2Fhusnes%2Fhusnes-sauna.jpg&w=828&q=75",
      ],
      tags: ["nordlys", "isbad", "boblebad", "tromsø", "eventyr"],
      location: "Tromsø",
      type: ["privat", "popular"],
      affiliateCode: "TROMSO30",
      hasDiscount: true,
    },
  ];

  // Get user's current location and city name
  const getCurrentLocation = async () => {
    try {
      setIsLoadingLocation(true);

      // Request permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Location permission denied");
        return;
      }

      // Get current position
      const currentLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = currentLocation.coords;

      // Reverse geocode to get city name
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (reverseGeocode.length > 0) {
        const address = reverseGeocode[0];
        const city =
          address.city || address.subregion || address.region || "Unknown";
        setLocation(city);
      }
    } catch (error) {
      console.error("Error getting location:", error);
      setLocation("Norway"); // Fallback to default
    } finally {
      setIsLoadingLocation(false);
    }
  };

  // Get location on component mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const openDrawer = (property: Property) => {
    setSelectedProperty(property);
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setSelectedProperty(null);
  };

  const openWebView = (property?: Property) => {
    console.log("Opening WebView...", property?.affiliateCode);
    // Store the property for WebView
    setWebViewProperty(property || null);
    // Close the property drawer first
    closeDrawer();
    // Wait a bit then open WebView
    setTimeout(() => {
      setWebViewVisible(true);
      Animated.timing(webViewTranslateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, 350);
  };

  const closeWebView = () => {
    Animated.timing(webViewTranslateY, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setWebViewVisible(false);
      setWebViewProperty(null);
    });
  };

  const copyAffiliateCode = async () => {
    if (webViewProperty?.affiliateCode) {
      try {
        await Clipboard.setStringAsync(webViewProperty.affiliateCode);
        Alert.alert(
          "Kopiert!",
          `Rabattkode "${webViewProperty.affiliateCode}" er kopiert til utklippstavlen`,
          [{ text: "OK" }]
        );
      } catch (error) {
        Alert.alert("Feil", "Kunne ikke kopiere rabattkoden");
      }
    }
  };

  const onWebViewGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: webViewTranslateY } }],
    { useNativeDriver: true }
  );

  const onWebViewHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      const { translationY, velocityY } = event.nativeEvent;

      if (translationY > 100 || velocityY > 500) {
        closeWebView();
      } else {
        Animated.spring(webViewTranslateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Sticky Tabs */}
      <View style={styles.stickyTabsContainer}>
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "popular" && styles.tabButtonActive,
            ]}
            onPress={() => setActiveTab("popular")}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === "popular" && styles.tabButtonTextActive,
              ]}
            >
              🔥 Populær
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "felles" && styles.tabButtonActive,
            ]}
            onPress={() => setActiveTab("felles")}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === "felles" && styles.tabButtonTextActive,
              ]}
            >
              👥 Felles
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "privat" && styles.tabButtonActive,
            ]}
            onPress={() => setActiveTab("privat")}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === "privat" && styles.tabButtonTextActive,
              ]}
            >
              👤 Privat
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable Content with Header */}
      <ScrollView
        style={styles.scrollableContent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section with Background Image */}
        <View style={styles.headerSection}>
          <Image
            source={{
              uri: "https://vestfjordsauna.no/_next/image?url=%2Fimg%2Fkjokkelvik%2Fkjokkelvik-sauna.jpg&w=828&q=75",
            }}
            style={styles.headerBackground}
          />
          <View style={styles.headerGradient} />

          {/* Navigation Bar */}
          <SafeAreaView style={styles.navBar} edges={["top"]}>
            <View style={styles.navContent}>
              <View style={styles.locationContainer}>
                <Ionicons name="paper-plane" size={16} color="#FFFFFF" />
                <Text style={styles.locationText}>
                  {isLoadingLocation ? "Loading..." : location}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.profileButton}
                onPress={() => router.push("/profile")}
              >
                <Ionicons name="person-circle" size={32} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </SafeAreaView>

          {/* Greeting */}
          <View style={styles.headerContent}>
            <Text style={styles.greetingText}>Velkommen!</Text>
            <Text style={styles.subtitleText}>
              Finn din perfekte sauna i Norge
            </Text>
            <View style={styles.headerStats}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>50+</Text>
                <Text style={styles.statLabel}>Saunaer</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>4.9</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>1000+</Text>
                <Text style={styles.statLabel}>Bookinger</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {activeTab === "popular"
              ? "Populære saunaer"
              : activeTab === "felles"
              ? "Felles saunaer"
              : "Private saunaer"}
          </Text>
          <Text style={styles.sectionSubtitle}>
            {saunas.filter((s) => s.type.includes(activeTab)).length} saunaer
            tilgjengelig
          </Text>
        </View>

        <View style={styles.propertiesContainer}>
          {saunas
            .filter((s) => s.type.includes(activeTab))
            .map((sauna) => (
              <View key={sauna.id} style={styles.propertyCardWrapper}>
                <TouchableOpacity
                  style={styles.propertyCard}
                  onPress={() => openDrawer(sauna)}
                  activeOpacity={0.9}
                >
                  <View style={styles.propertyImageContainer}>
                    <Image
                      source={{ uri: sauna.image }}
                      style={styles.propertyImage}
                    />
                    {/* Dark gradient overlay for readability */}
                    <View style={styles.imageOverlay} />
                    {/* Top location pill */}
                    <View style={styles.overlayTopRow}>
                      <View style={styles.locationPill}>
                        <Ionicons name="pin" size={12} color="#FFFFFF" />
                        <Text style={styles.locationPillText} numberOfLines={1}>
                          {sauna.location} (30 km fra deg)
                        </Text>
                      </View>
                    </View>
                    {/* Bottom title + rating */}
                    <View style={styles.overlayBottomRow}>
                      <Text style={styles.overlayTitle} numberOfLines={1}>
                        {sauna.title.replace(/\s*-\s*Vestfjord Sauna/i, "")}
                      </Text>
                      <View style={styles.ratingBadge}>
                        <Ionicons name="star" size={12} color="#F59E0B" />
                        <Text style={styles.ratingBadgeText}>
                          {sauna.rating.toFixed(2)}
                        </Text>
                      </View>
                    </View>
                    <HeartButton property={sauna} variant="card" />
                  </View>

                  {/* Footer with price + CTA */}
                  <View style={styles.cardFooter}>
                    <View style={styles.priceColumn}>
                      {sauna.hasDiscount && (
                        <Text style={styles.footerOriginalPrice}>
                          {sauna.originalPrice} kr
                        </Text>
                      )}
                      <View style={styles.priceRow}>
                        <Text style={styles.footerCurrentPrice}>
                          {sauna.currentPrice} kr
                        </Text>
                        <Text style={styles.perTimeText}> per time</Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.bookButton}
                      onPress={() => openDrawer(sauna)}
                      activeOpacity={0.9}
                    >
                      <Text style={styles.bookButtonText}>
                        {sauna.affiliateCode
                          ? "Bestill med rabatt"
                          : "Bestill nå"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </View>
            ))}
        </View>

        {/* Bottom padding for tab bar */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Property Details Drawer */}
      <PropertyDrawer
        visible={drawerVisible}
        property={selectedProperty}
        onClose={closeDrawer}
        onBookPress={() => openWebView(selectedProperty || undefined)}
      />

      {/* WebView Drawer */}
      <Modal
        visible={webViewVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeWebView}
        statusBarTranslucent={true}
      >
        <View style={styles.webViewModalOverlay}>
          <TouchableOpacity
            style={styles.webViewModalBackground}
            activeOpacity={1}
            onPress={closeWebView}
          />
          <PanGestureHandler
            onGestureEvent={onWebViewGestureEvent}
            onHandlerStateChange={onWebViewHandlerStateChange}
          >
            <Animated.View
              style={[
                styles.webViewContainer,
                {
                  transform: [{ translateY: webViewTranslateY }],
                },
              ]}
            >
              <View style={styles.webViewHandle} />

              <View style={styles.webViewHeader}>
                <View style={styles.webViewTitleContainer}>
                  <Text style={styles.webViewTitle}>
                    {webViewProperty?.affiliateCode
                      ? `Rabattkode: ${webViewProperty.affiliateCode}`
                      : "Bestill sauna"}
                  </Text>
                  {webViewProperty?.affiliateCode && (
                    <TouchableOpacity
                      style={styles.copyButton}
                      onPress={copyAffiliateCode}
                    >
                      <Ionicons name="copy-outline" size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                  )}
                </View>
                <TouchableOpacity
                  style={styles.webViewCloseButton}
                  onPress={closeWebView}
                >
                  <Ionicons name="close" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              <WebView
                source={{
                  uri: "https://minside.periode.no/booking/50T6eLFiASP7kvmFG7np/QUSFMv39U75BnMW1cPSv/",
                }}
                style={styles.webView}
                startInLoadingState={true}
                scalesPageToFit={true}
                javaScriptEnabled={true}
                domStorageEnabled={true}
              />
            </Animated.View>
          </PanGestureHandler>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerSection: {
    height: height * 0.45,
    position: "relative",
    marginTop: -20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: "hidden",
  },
  scrollContent: {
    paddingBottom: 120, // Add padding for tab bar and shadow
  },
  headerBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
  },
  headerGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  navBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  navContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 0,
    paddingTop: 0,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  locationText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  profileButton: {
    padding: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerContent: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  greetingText: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 8,
    lineHeight: 38,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitleText: {
    color: "#F3F4F6",
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 24,
    lineHeight: 24,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  statItem: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    minWidth: 80,
    backdropFilter: "blur(10px)",
  },
  statNumber: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 2,
  },
  statLabel: {
    color: "#E5E7EB",
    fontSize: 12,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  stickyTabsContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    paddingTop: 60, // Better spacing from top
    paddingBottom: 16, // Add bottom padding for breathing room
    paddingHorizontal: 20,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  scrollableContent: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: 120, // Adjusted for better tab spacing
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  tabsContainer: {
    flexDirection: "row",
    marginBottom: 0,
    gap: 8, // Optimal gap for better visual balance
  },
  tabButton: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingVertical: 14, // Increased for better touch target
    paddingHorizontal: 16,
    borderRadius: 999, // Fully rounded buttons
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  tabButtonActive: {
    backgroundColor: "#111827",
    borderColor: "#111827",
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  tabButtonText: {
    color: "#374151",
    fontWeight: "600",
    fontSize: 15,
    letterSpacing: 0.5,
  },
  tabButtonTextActive: {
    color: "#FFFFFF",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#6B7280",
    marginBottom: 8,
  },
  propertiesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  propertyCardWrapper: {
    borderRadius: 18,
    marginBottom: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
    backgroundColor: "transparent",
  },
  propertyCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
  },
  propertyImageContainer: {
    position: "relative",
  },
  propertyImage: {
    width: "100%",
    height: 190,
    borderRadius: 16,
  },
  imageOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.35)",
    borderRadius: 16,
  },
  overlayTopRow: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  locationPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  locationPillText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  overlayBottomRow: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  overlayTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    flex: 1,
    marginRight: 10,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingBadgeText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: "700",
    color: "#111827",
  },
  propertyInfo: {
    padding: 16,
  },
  propertyTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  propertyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
    flex: 1,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    color: "#1F2937",
    fontWeight: "500",
  },
  propertyDetails: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 12,
  },
  pricingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: "#9CA3AF",
    textDecorationLine: "line-through",
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
  },
  totalPrice: {
    fontSize: 14,
    color: "#6B7280",
  },
  // New footer matching screenshot
  cardFooter: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  priceColumn: {
    flexDirection: "column",
    alignItems: "flex-start",
    flexShrink: 1,
  },
  footerOriginalPrice: {
    fontSize: 12,
    color: "#9CA3AF",
    textDecorationLine: "line-through",
    marginBottom: 2,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  footerCurrentPrice: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
  },
  perTimeText: {
    fontSize: 14,
    color: "#111827",
    marginLeft: 6,
  },
  bookButton: {
    backgroundColor: "#111827",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 26,
  },
  bookButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  additionalSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  bottomPadding: {
    height: 120,
  },
  // WebView Drawer Styles
  webViewContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.9,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 1000,
  },
  webViewHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#D1D5DB",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  webViewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#374151",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  webViewTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  webViewTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  copyButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    padding: 6,
    marginLeft: 8,
  },
  webViewCloseButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    padding: 8,
  },
  webView: {
    flex: 1,
  },
  webViewModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
    zIndex: 2000,
  },
  webViewModalBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
