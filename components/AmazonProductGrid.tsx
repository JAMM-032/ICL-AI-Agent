"use client";

import React from 'react';
import { FlatList, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { AmazonProduct } from './AmazonProduct';
import { useTheme } from './ui/ThemeProvider';

interface AmazonProductGridProps {
  title?: string;
  urls: string[];
}

export function AmazonProductGrid({ title, urls }: AmazonProductGridProps) {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  
  // Calculate number of columns based on screen width
  const numColumns = Math.max(1, Math.floor(width / 320));
  
  return (
    <View style={styles.container}>
      {title && (
        <Text 
          style={[
            styles.title,
            { color: theme === 'dark' ? '#FFFFFF' : '#000000' }
          ]}
        >
          {title}
        </Text>
      )}
      
      <FlatList
        data={urls}
        numColumns={numColumns}
        renderItem={({ item }) => (
          <View style={[styles.productContainer, { width: width / numColumns - 32 }]}>
            <AmazonProduct url={item} />
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  listContent: {
    padding: 8,
  },
  productContainer: {
    margin: 8,
  },
}); 