import React, { useState, useRef } from 'react';
import { View, ScrollView, Dimensions, StyleSheet, Image } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

interface CarouselItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
}

interface CarouselProps {
  items: CarouselItem[];
  height?: number;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

const { width: screenWidth } = Dimensions.get('window');

export function Carousel({ 
  items, 
  height = 250, 
  autoPlay = true, 
  autoPlayInterval = 3000 
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const scrollToIndex = (index: number) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: index * screenWidth,
        animated: true,
      });
    }
  };

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / screenWidth);
    setCurrentIndex(index);
  };

  // Auto-play functionality
  React.useEffect(() => {
    if (!autoPlay || items.length <= 1) return;

    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % items.length;
      scrollToIndex(nextIndex);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [currentIndex, autoPlay, autoPlayInterval, items.length]);

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={[styles.scrollView, { height }]}
      >
        {items.map((item, index) => (
          <View key={item.id} style={[styles.slide, { width: screenWidth, height }]}>
            <View style={styles.imageContainer}>
              {item.imageUrl ? (
                <Image source={{ uri: item.imageUrl }} style={styles.image} />
              ) : (
                <View style={styles.placeholderImage}>
                  <ThemedText style={styles.placeholderText}>Image Placeholder</ThemedText>
                </View>
              )}
            </View>
            <View style={styles.contentContainer}>
              <ThemedText type="subtitle" style={styles.title}>
                {item.title}
              </ThemedText>
              <ThemedText style={styles.description}>
                {item.description}
              </ThemedText>
            </View>
          </View>
        ))}
      </ScrollView>
      
      {/* Dots indicator */}
      <View style={styles.dotsContainer}>
        {items.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              { backgroundColor: index === currentIndex ? '#3B82F6' : '#D1D5DB' }
            ]}
          />
        ))}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    height: '70%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  placeholderText: {
    color: '#6B7280',
    fontSize: 16,
  },
  contentContainer: {
    padding: 16,
    width: '100%',
    height: '30%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});
