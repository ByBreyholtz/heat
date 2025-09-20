import HeartButton from "@/components/ui/heart-button";
import PropertyDrawer, { Property } from "@/components/ui/property-drawer";
import { useFavorites } from "@/contexts/FavoritesContext";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
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

export default function FavoritesScreen() {
  const { favoriteProperties, toggleFavorite, isFavorited, loading } =
    useFavorites();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [webViewVisible, setWebViewVisible] = useState(false);
  const [webViewProperty, setWebViewProperty] = useState<Property | null>(null);
  const webViewTranslateY = useRef(new Animated.Value(height)).current;
  const cardAnimations = useRef(
    favoriteProperties.map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    if (!loading && favoriteProperties.length > 0) {
      // Animate cards in sequence
      cardAnimations.forEach((animation, index) => {
        Animated.timing(animation, {
          toValue: 1,
          duration: 300,
          delay: index * 100,
          useNativeDriver: true,
        }).start();
      });
    }
  }, [loading, favoriteProperties.length, cardAnimations]);

  const openDrawer = (property: any) => {
    setSelectedProperty({
      ...property,
      tags: property.tags || [],
      location: property.location || "Norway",
    });
    setDrawerVisible(true);
  };

  const openWebView = (property?: Property) => {
    console.log("Opening WebView from favorites...", property?.affiliateCode);
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

  const closeDrawer = () => {
    setDrawerVisible(false);
    setSelectedProperty(null);
  };

  const navigateToDiscover = () => {
    router.push("/");
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>Your Favorites</Text>
              <Text style={styles.headerSubtitle}>Loading...</Text>
            </View>
            <View style={styles.headerIconContainer}>
              <Ionicons name="heart" size={24} color="#FF6B6B" />
            </View>
          </View>
        </View>

        <View style={styles.loadingContainer}>
          <View style={styles.loadingIconContainer}>
            <ActivityIndicator size="large" color="#FF6B6B" />
          </View>
          <Text style={styles.loadingText}>Loading your favorites...</Text>
          <Text style={styles.loadingSubtext}>Please wait a moment</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (favoriteProperties.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>Your Favorites</Text>
              <Text style={styles.headerSubtitle}>0 saunas saved</Text>
            </View>
            <View style={styles.headerIconContainer}>
              <Ionicons name="heart" size={24} color="#FF6B6B" />
            </View>
          </View>
        </View>

        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="heart-outline" size={80} color="#E5E7EB" />
          </View>
          <Text style={styles.emptyTitle}>No favorites yet</Text>
          <Text style={styles.emptyText}>
            Start exploring saunas and tap the heart icon to add them to your
            favorites!
          </Text>
          <TouchableOpacity
            style={styles.exploreButton}
            activeOpacity={0.8}
            onPress={navigateToDiscover}
          >
            <Ionicons name="search" size={20} color="#FFFFFF" />
            <Text style={styles.exploreButtonText}>Explore Saunas</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Your Favorites</Text>
            <Text style={styles.headerSubtitle}>
              {favoriteProperties.length}{" "}
              {favoriteProperties.length === 1 ? "sauna" : "saunas"} saved
            </Text>
          </View>
          <View style={styles.headerIconContainer}>
            <Ionicons name="heart" size={24} color="#FF6B6B" />
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {favoriteProperties.map((sauna, index) => {
          const cardAnimation = cardAnimations[index] || new Animated.Value(1);
          return (
            <Animated.View
              key={sauna.id}
              style={[
                { marginTop: index === 0 ? 0 : 16 },
                {
                  opacity: cardAnimation,
                  transform: [
                    {
                      translateY: cardAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [50, 0],
                      }),
                    },
                    {
                      scale: cardAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.9, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              <TouchableOpacity
                style={styles.favoriteCard}
                onPress={() => openDrawer(sauna)}
                activeOpacity={0.8}
              >
                <View style={styles.favoriteImageContainer}>
                  <Image
                    source={{ uri: sauna.image }}
                    style={styles.favoriteImage}
                    resizeMode="cover"
                  />
                  <View style={styles.imageOverlay} />
                  <HeartButton
                    property={sauna}
                    variant="favorites"
                    size="medium"
                  />
                  <View style={styles.ratingBadge}>
                    <Ionicons name="star" size={12} color="#FFFFFF" />
                    <Text style={styles.ratingBadgeText}>{sauna.rating}</Text>
                  </View>
                </View>

                <View style={styles.favoriteInfo}>
                  <View style={styles.favoriteTitleRow}>
                    <Text style={styles.favoriteTitle} numberOfLines={2}>
                      {sauna.title}
                    </Text>
                    <View style={styles.reviewsContainer}>
                      <Text style={styles.reviewsText}>
                        ({sauna.reviews} reviews)
                      </Text>
                    </View>
                  </View>

                  <View style={styles.detailsContainer}>
                    <View style={styles.detailItem}>
                      <Ionicons name="people" size={16} color="#6B7280" />
                      <Text style={styles.detailText}>
                        {sauna.capacity} personer
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Ionicons name="thermometer" size={16} color="#6B7280" />
                      <Text style={styles.detailText}>{sauna.temperature}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Ionicons name="time" size={16} color="#6B7280" />
                      <Text style={styles.detailText}>{sauna.duration}</Text>
                    </View>
                  </View>

                  <View style={styles.pricingContainer}>
                    <View style={styles.priceRow}>
                      <Text style={styles.originalPrice}>
                        {sauna.originalPrice} kr
                      </Text>
                      <Text style={styles.currentPrice}>
                        {sauna.currentPrice} kr
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    backgroundColor: "#FAFAFA",
  },
  loadingIconContainer: {
    width: 80,
    height: 80,
    backgroundColor: "#FEF2F2",
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  loadingSubtext: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    backgroundColor: "#FAFAFA",
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    backgroundColor: "#F9FAFB",
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 12,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
    maxWidth: 280,
  },
  exploreButton: {
    backgroundColor: "#FF6B6B",
    borderRadius: 25,
    paddingHorizontal: 32,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    shadowColor: "#FF6B6B",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  exploreButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  headerIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: "#FEF2F2",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 16,
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    minHeight: "100%",
  },
  favoriteCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    overflow: "hidden",
  },
  favoriteImageContainer: {
    position: "relative",
    height: 220,
  },
  favoriteImage: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  ratingBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  favoriteInfo: {
    padding: 20,
  },
  favoriteTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  favoriteTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    flex: 1,
    marginRight: 12,
    lineHeight: 24,
  },
  reviewsContainer: {
    alignItems: "flex-end",
  },
  reviewsText: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingVertical: 8,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  detailText: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },
  pricingContainer: {
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 16,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  originalPrice: {
    fontSize: 14,
    color: "#9CA3AF",
    textDecorationLine: "line-through",
    fontWeight: "500",
  },
  currentPrice: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
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
