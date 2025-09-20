import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

interface BarChartData {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: BarChartData[];
  title?: string;
  height?: number;
  showValues?: boolean;
  maxValue?: number;
}

const { width: screenWidth } = Dimensions.get('window');

export function BarChart({ 
  data, 
  title, 
  height = 200, 
  showValues = true,
  maxValue 
}: BarChartProps) {
  const maxDataValue = maxValue || Math.max(...data.map(item => item.value));
  const chartWidth = screenWidth - 40; // Account for padding
  const barWidth = chartWidth / data.length - 8; // Account for spacing

  const defaultColors = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#06B6D4', // Cyan
    '#84CC16', // Lime
    '#F97316', // Orange
  ];

  return (
    <ThemedView style={styles.container}>
      {title && (
        <ThemedText type="subtitle" style={styles.title}>
          {title}
        </ThemedText>
      )}
      
      <View style={[styles.chartContainer, { height: height - 20 }]}>
        <View style={styles.barsContainer}>
          {data.map((item, index) => {
            const barHeight = (item.value / maxDataValue) * (height - 60); // More space for labels
            const color = item.color || defaultColors[index % defaultColors.length];
            
            return (
              <View key={index} style={styles.barWrapper}>
                <View style={styles.barContainer}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: barHeight,
                        backgroundColor: color,
                        width: barWidth,
                      },
                    ]}
                  />
                  {showValues && (
                    <ThemedText style={styles.valueText}>
                      {item.value}
                    </ThemedText>
                  )}
                </View>
                <ThemedText style={styles.labelText} numberOfLines={2}>
                  {item.label}
                </ThemedText>
              </View>
            );
          })}
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    marginTop: 16, // Add more top margin
  },
  title: {
    marginBottom: 20, // Increase bottom margin
    textAlign: 'center',
  },
  chartContainer: {
    justifyContent: 'flex-end',
    marginTop: 8, // Add top margin to chart
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '100%',
  },
  barWrapper: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 2,
  },
  barContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
    paddingBottom: 30, // More space for labels
  },
  bar: {
    borderRadius: 4,
    marginBottom: 4,
  },
  valueText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  labelText: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 60,
  },
});
