"use client";

import { useActions } from 'ai/rsc';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AI } from './ai-context';
import { SimpleCard } from './SimpleCard';
import { useTheme } from './ui/ThemeProvider';

interface CardItem {
  id?: string;
  title: string;
  metadata?: any; // Can store any additional data
  // Add any other properties your Card component accepts
}

interface CardListProps {
  title?: string;
  items: CardItem[];
  horizontal?: boolean;
  onCardPress?: (title: string) => void;
}

export function CardList({ title, items, horizontal = true, onCardPress }: CardListProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { onSubmit } = useActions(AI);
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  
  const handleCardPress = (item: CardItem) => {
    console.log(`Card pressed:`, item);
    
    if (onCardPress) {
      onCardPress(item.title);
    } else {
      // Send structured data as JSON
      const cardData = {
        action: 'card_press',
        id: item.id,
        title: item.title,
        metadata: item.metadata
      };
      
      // Convert to string for submission
      onSubmit(JSON.stringify(cardData));
    }
  };
  
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
                onPress={() => handleCardPress(item)}
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
                onPress={() => handleCardPress(item)}
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