import HeartButton from "@/components/ui/heart-button";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";

const { height, width } = Dimensions.get("window");

// Image Carousel Component
interface ImageCarouselProps {
  images: string[];
  height?: number;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  height = 250,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const autoScrollTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-scroll functionality
  useEffect(() => {
    if (images.length <= 1) return;

    const startAutoScroll = () => {
      autoScrollTimer.current = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % images.length;
          flatListRef.current?.scrollToIndex({
            index: nextIndex,
            animated: true,
          });
          return nextIndex;
        });
      }, 5000); // Auto-scroll every 5 seconds
    };

    startAutoScroll();

    return () => {
      if (autoScrollTimer.current) {
        clearInterval(autoScrollTimer.current);
      }
    };
  }, [images.length]);

  const onScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    setCurrentIndex(roundIndex);
  };

  const renderImage = ({ item }: { item: string }) => (
    <Image source={{ uri: item }} style={[styles.carouselImage, { height }]} />
  );

  const renderPaginationDots = () => (
    <View style={styles.paginationContainer}>
      {images.map((_, index) => (
        <View
          key={index}
          style={[
            styles.paginationDot,
            {
              backgroundColor:
                index === currentIndex ? "#FFFFFF" : "rgba(255, 255, 255, 0.5)",
            },
          ]}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.carouselContainer}>
      <FlatList
        ref={flatListRef}
        data={images}
        renderItem={renderImage}
        keyExtractor={(item, index) => `${item}-${index}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(event) => {
          const slideSize = event.nativeEvent.layoutMeasurement.width;
          const index = event.nativeEvent.contentOffset.x / slideSize;
          setCurrentIndex(Math.round(index));
        }}
      />
      {images.length > 1 && renderPaginationDots()}
    </View>
  );
};

export interface Property {
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

interface PropertyDrawerProps {
  visible: boolean;
  property: Property | null;
  onClose: () => void;
  onBookPress?: () => void;
}

const PropertyDrawer: React.FC<PropertyDrawerProps> = ({
  visible,
  property,
  onClose,
  onBookPress,
}) => {
  const drawerTranslateY = useRef(new Animated.Value(height)).current;

  React.useEffect(() => {
    if (visible) {
      // Reset to bottom position first, then animate up
      drawerTranslateY.setValue(height);
      Animated.timing(drawerTranslateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(drawerTranslateY, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, drawerTranslateY]);

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: drawerTranslateY } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      const { translationY, velocityY } = event.nativeEvent;

      // Simple drawer close logic based on drag distance and velocity
      if (translationY > 100 || velocityY > 500) {
        onClose();
      } else {
        Animated.spring(drawerTranslateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  if (!property) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.modalBackground}
          activeOpacity={1}
          onPress={onClose}
        />
        <PanGestureHandler
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={onHandlerStateChange}
        >
          <Animated.View
            style={[
              styles.drawerContainer,
              {
                transform: [{ translateY: drawerTranslateY }],
              },
            ]}
          >
            <View style={styles.drawerHandle} />

            <View style={{ flex: 1 }}>
              <ScrollView
                style={styles.drawerContent}
                contentContainerStyle={styles.drawerScrollContent}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.drawerImageContainer}>
                  <ImageCarousel
                    images={property.images || [property.image]}
                    height={250}
                  />
                  <TouchableOpacity
                    style={styles.drawerCloseButton}
                    onPress={onClose}
                  >
                    <Ionicons name="close" size={24} color="#FFFFFF" />
                  </TouchableOpacity>
                  <HeartButton
                    property={property}
                    variant="drawer"
                    size="large"
                  />
                </View>

                <View style={styles.drawerInfo}>
                  <View style={styles.drawerTitleRow}>
                    <Text style={styles.drawerTitle}>{property.title}</Text>
                    <View style={styles.drawerRatingContainer}>
                      <Ionicons name="star" size={16} color="#000000" />
                      <Text style={styles.drawerRatingText}>
                        {property.rating} ({property.reviews})
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.drawerDetails}>
                    {property.capacity} personer • {property.temperature} •{" "}
                    {property.duration}
                  </Text>

                  <View style={styles.drawerPricingContainer}>
                    {property.hasDiscount ? (
                      <>
                        <Text style={styles.drawerOriginalPrice}>
                          {property.originalPrice} kr
                        </Text>
                        <Text style={styles.drawerCurrentPrice}>
                          {property.currentPrice} kr
                        </Text>
                      </>
                    ) : (
                      <>
                        <Text style={styles.drawerCurrentPrice}>
                          {property.currentPrice} kr
                        </Text>
                      </>
                    )}
                  </View>

                  <View style={styles.drawerDescription}>
                    <Text style={styles.drawerDescriptionTitle}>
                      Om denne saunaen
                    </Text>
                    <Text style={styles.drawerDescriptionText}>
                      {property.description}
                    </Text>
                  </View>

                  <View style={styles.drawerAmenities}>
                    <Text style={styles.drawerAmenitiesTitle}>Fasiliteter</Text>
                    <View style={styles.amenitiesGrid}>
                      {property.facilities.map((facility, index) => (
                        <View key={index} style={styles.amenityItem}>
                          <Ionicons
                            name="checkmark-circle"
                            size={20}
                            color="#10B981"
                          />
                          <Text style={styles.amenityText}>{facility}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              </ScrollView>

              {onBookPress && (
                <View style={styles.fixedBookingBar}>
                  <View style={styles.bookingInfo}>
                    <Text style={styles.bookingPrice}>
                      {property.currentPrice} kr
                    </Text>
                    {property.affiliateCode && (
                      <Text style={styles.affiliateCode}>
                        Rabattkode: {property.affiliateCode}
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity
                    style={styles.fixedBookButton}
                    onPress={onBookPress}
                  >
                    <Text style={styles.fixedBookButtonText}>
                      {property.affiliateCode
                        ? "Bestill med rabatt"
                        : "Bestill nå"}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </Animated.View>
        </PanGestureHandler>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalBackground: {
    flex: 1,
  },
  drawerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.9,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  drawerHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#D1D5DB",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  drawerContent: {
    flex: 1,
  },
  drawerScrollContent: {
    paddingBottom: 100, // Space for fixed booking bar
  },
  drawerImageContainer: {
    position: "relative",
  },
  drawerImage: {
    width: "100%",
    height: 250,
  },
  // Carousel Styles
  carouselContainer: {
    position: "relative",
  },
  carouselImage: {
    width: width,
    resizeMode: "cover",
  },
  paginationContainer: {
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  drawerCloseButton: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: 8,
  },
  drawerInfo: {
    padding: 20,
  },
  drawerTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  drawerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    flex: 1,
    marginRight: 12,
  },
  drawerRatingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  drawerRatingText: {
    fontSize: 16,
    color: "#1F2937",
    fontWeight: "500",
  },
  drawerDetails: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 16,
  },
  drawerPricingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 24,
  },
  drawerOriginalPrice: {
    fontSize: 16,
    color: "#9CA3AF",
    textDecorationLine: "line-through",
  },
  drawerCurrentPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
  },
  drawerTotalPrice: {
    fontSize: 16,
    color: "#6B7280",
  },
  drawerDescription: {
    marginBottom: 24,
  },
  drawerDescriptionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  drawerDescriptionText: {
    fontSize: 16,
    color: "#6B7280",
    lineHeight: 24,
  },
  drawerAmenities: {
    marginBottom: 24,
  },
  drawerAmenitiesTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 12,
  },
  amenitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  amenityItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    width: "48%",
  },
  amenityText: {
    fontSize: 14,
    color: "#1F2937",
  },
  // Fixed Booking Bar Styles
  fixedBookingBar: {
    position: "absolute",
    bottom: 10,
    left: 20,
    right: 20,
    backgroundColor: "#374151",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 20,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  bookingInfo: {
    flex: 1,
  },
  bookingDate: {
    color: "#FFFFFF",
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 2,
  },
  bookingPrice: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  affiliateCode: {
    color: "#10B981",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 2,
  },
  fixedBookButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    paddingHorizontal: 24,
    paddingVertical: 12,
    minWidth: 120,
    alignItems: "center",
  },
  fixedBookButtonText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default PropertyDrawer;
