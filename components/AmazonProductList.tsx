"use client";

import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AmazonProduct } from './AmazonProduct';
import { useTheme } from './ui/ThemeProvider';

interface AmazonProductListProps {
  title?: string;
  urls: string[];
}

export function AmazonProductList({ title, urls }: AmazonProductListProps) {
  const { theme } = useTheme();
  
  if (!urls || urls.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text>No products found.</Text>
      </View>
    );
  }
  
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
      
      <ScrollView 
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {urls.map((url, index) => (
          <View key={index} style={styles.productContainer}>
            <AmazonProduct url={url} />
          </View>
        ))}
      </ScrollView>
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
  scrollContent: {
    paddingHorizontal: 8,
  },
  productContainer: {
    width: 280,
    marginHorizontal: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 