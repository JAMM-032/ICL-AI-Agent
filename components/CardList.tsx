"use client";

import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SimpleCard } from './SimpleCard';
import { useTheme } from './ui/ThemeProvider';
import { onSubmit } from './ai-context';

interface CardItem {
  title: string;
  // Add any other properties your Card component accepts
}

interface CardListProps {
  title: string;
  items: CardItem[];
  horizontal?: boolean;
}

export function CardList({ title, items, horizontal = true }: CardListProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  if (!items || items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={{ color: isDark ? '#FFFFFF' : '#000000' }}>
          No items found.
        </Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {title && (
        <Text 
          style={[
            styles.title,
            { color: isDark ? '#FFFFFF' : '#000000' }
          ]}
        >
          {title}
        </Text>
      )}
      
      {horizontal ? (
        <ScrollView 
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {items.map((item, index) => (
            <View key={index} style={styles.cardContainer}>
              <SimpleCard 
                title={item.title}
                onPress={() => {/* handle press if needed */}}
              />
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.gridContainer}>
          {items.map((item, index) => (
            <View key={index} style={styles.gridCardContainer}>
              <SimpleCard 
                title={item.title}
                onPress={() => {
                  console.log("item", item.title);
                }}
              />
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  emptyContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingHorizontal: 8,
  },
  cardContainer: {
    width: 280,
    marginHorizontal: 8,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 8,
  },
  gridCardContainer: {
    width: '50%', // Two columns
    padding: 8,
  },
}); 