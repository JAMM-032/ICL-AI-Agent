"use client";

import * as Haptics from 'expo-haptics';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useTheme } from './ui/ThemeProvider';

interface SimpleCardProps {
  title: string;
  onPress?: () => void;
}

export function SimpleCard({ title, onPress }: SimpleCardProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const handlePress = () => {
    // Add haptic feedback on iOS
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (onPress) {
      onPress();
    }
  };
  
  return (
    <TouchableOpacity
      style={[
        styles.card,
        { 
          backgroundColor: isDark ? '#2C2C2E' : '#FFFFFF',
          borderColor: isDark ? '#3A3A3C' : '#E5E5EA',
        }
      ]}
      onPress={handlePress}
      disabled={!onPress}
    >
      <Text 
        style={[
          styles.title,
          { color: isDark ? '#FFFFFF' : '#000000' }
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
});
