"use client";

import React, { useEffect, useState } from 'react';
import { Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from "./ui/ThemeProvider";

const X_RAPIDAPI_KEY = "1f45a600e9msh60fc0bffaf620fep14dc45jsn57144d9a4bf7";

interface AmazonProductProps {
  title: string;
  image: string;
  price: string;
  rating?: string;
  url: string;
  description?: string;
}

interface AmazonProductsProps {
  urls: string[];
  title?: string;
}

function extractAmazonProductInfo(url: string): { countryCode: string; productCode: string } {
  // Create a URL object to parse the provided URL string.
  const parsedUrl = new URL(url);
  const hostnameParts = parsedUrl.hostname.split('.');
  let countryCode = hostnameParts[hostnameParts.length - 1];
  if (countryCode === 'com') {
    countryCode = 'us';
  }

  const productCode = parsedUrl.pathname.split('/')[3];
  return { countryCode, productCode };
}

async function fetch_product_info(productCode: string, countryCode: string) {
  console.log(productCode, countryCode);
  const fetcing_url = `https://real-time-amazon-data.p.rapidapi.com/product-details?asin=${productCode}&country=${countryCode}`
  const headers = {
    'Accept': 'application/json',
    'X-Rapidapi-Key': X_RAPIDAPI_KEY
  };
  try {
    // Send the GET request to the API endpoint.
    const response = await fetch(fetcing_url, { method: 'GET', headers: headers });

    // Check if the response is ok (status in the range 200-299)
    if (!response) {
      throw new Error('Error fetching post. Status: ');
    }

    // Parse the response JSON as the expected type.
    const data = await response.json();
    console.log(data);
    const image = data.data.product_photos[0];
    console.log(image);
    const title = data.data.product_title;
    let price = data.data.product_price;
    if (price === null) {
      price = data.data.product_original_price;
      if (price === null) {
        price = "unknown";
      }
    }
    const rating = data.data.product_star_rating;
    const currency = data.data.currency;
    return {image, title, price, rating, currency};
  } catch (error) {
    // Log the error and rethrow for further handling if needed.
    console.error("Fetch error:", error);
    throw error;
  }
}

export function AmazonProduct({
  url
}: AmazonProductProps) {
  const { theme } = useTheme();
  const [image, setImage] = useState('');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [rating, setRating] = useState('');
  const [currency, setCurrency] = useState('');
  const { countryCode, productCode } = extractAmazonProductInfo(url);
  useEffect( () => {
    const fetch_product_info_async = async () => {
      const {image, title, price, rating, currency} = await fetch_product_info(productCode, countryCode);
      setImage(image);
      setTitle(title);
      setPrice(price);
      setRating(rating);
      setCurrency(currency);
    }
    fetch_product_info_async();
  }, []);
  const handlePress = () => {
    // if (process.env.EXPO_OS === "ios") {
    //   Haptics.selectionAsync();
    // }
    Linking.openURL(url);
  };
  
  return (
    <TouchableOpacity 
      onPress={handlePress}
      style={[
        styles.container,
        {
          backgroundColor: theme === 'dark' ? '#2C2C2E' : '#F2F2F7',
          borderColor: theme === 'dark' ? '#3C3C3E' : '#E5E5EA',
        }
      ]}
      
    >
      <View style={styles.content}>
        <Image 
          source={{ uri: image }} 
          style={styles.image}
          resizeMode="contain"
        />
        
        <View style={styles.details}>
          <Text 
            style={[
              styles.title,
              { color: theme === 'dark' ? '#FFFFFF' : '#000000' }
            ]}
            numberOfLines={2}
          >
            {title}
          </Text>
          
          {rating && (
            <Text 
              style={[
                styles.rating,
                { color: theme === 'dark' ? '#FFCC00' : '#FF9500' }
              ]}
            >
              {rating} ★
            </Text>
          )}
          
          <Text 
            style={[
              styles.price,
              { color: theme === 'dark' ? '#FFFFFF' : '#000000' }
            ]}
          >
            {price} {currency}
          </Text>
          
          
            <Text 
              style={[
                styles.description,
                { color: theme === 'dark' ? '#CCCCCC' : '#666666' }
              ]}
              numberOfLines={2}
            >
              hey
            </Text>
          
        </View>
      </View>
      
      <View 
        style={[
          styles.amazonBadge,
          { backgroundColor: '#FF9900' }
        ]}
      >
        <Text style={styles.amazonText}>amazon</Text>
      </View>
    </TouchableOpacity>
  );
}

export function AmazonProducts({ urls, title }: AmazonProductsProps) {
  const { theme } = useTheme();
  
  return (
    <View style={styles.productsContainer}>
      {title && (
        <Text 
          style={[
            styles.sectionTitle,
            { color: theme === 'dark' ? '#FFFFFF' : '#000000' }
          ]}
        >
          {title}
        </Text>
      )}
      
      {urls.map((url, index) => (
        <AmazonProduct key={index} url={url} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 8,
    marginHorizontal: 16,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    padding: 12,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  details: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    lineHeight: 18,
  },
  amazonBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderBottomLeftRadius: 8,
  },
  amazonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  productsContainer: {
    gap: 16,
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
}); 