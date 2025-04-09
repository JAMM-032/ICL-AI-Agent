import { useTheme } from '@/components/ui/ThemeProvider';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import './lightmode.css';
const Switch = () => {
  const { theme, setTheme } = useTheme();
  
  const handleClick = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    console.log(theme + " from lightmode");
  };

  // For web, we can use the styled component approach
  if (Platform.OS === 'web') {
    return (
      <div className="theme-switch-wrapper">
        <label className="switch">
          <input 
            onClick={handleClick} 
            defaultChecked={theme === 'light'} 
            id="checkbox" 
            type="checkbox" 
          />
          <span className="slider">
            <div className="star star_1" />
            <div className="star star_2" />
            <div className="star star_3" />
            <svg viewBox="0 0 16 16" className="cloud_1 cloud">
              <path 
                transform="matrix(.77976 0 0 .78395-299.99-418.63)" 
                fill="#fff" 
                d="m391.84 540.91c-.421-.329-.949-.524-1.523-.524-1.351 0-2.451 1.084-2.485 2.435-1.395.526-2.388 1.88-2.388 3.466 0 1.874 1.385 3.423 3.182 3.667v.034h12.73v-.006c1.775-.104 3.182-1.584 3.182-3.395 0-1.747-1.309-3.186-2.994-3.379.007-.106.011-.214.011-.322 0-2.707-2.271-4.901-5.072-4.901-2.073 0-3.856 1.202-4.643 2.925" 
              />
            </svg>
          </span>
        </label>
      </div>
    );
  }
  else {
    // For native platforms (iOS, Android)
    const styles = getStyles(theme);
    return (
        <TouchableOpacity onPress={handleClick} style={styles.container}>
        <View style={styles.switchContainer}>
            <Text style={styles.text}>
            {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </Text>
        </View>
        </TouchableOpacity>
    );
  }
};
// Styles for native platforms
const getStyles = (theme) =>
    StyleSheet.create({
      container: {
        width: 80,
        height: 40,
        // For instance, use a dark grey when dark is active, and a lighter color otherwise.
        backgroundColor: theme === 'dark' ? '#1C1C1C' : '#EFEFEF',
        justifyContent: 'center',
        alignItems: 'center',
      },
      switchContainer: {
        padding: 8,
        borderRadius: 10,
        // Use true black for dark mode (or choose a subtle off-black if you'd prefer)
        backgroundColor: theme === 'dark' ? 'black' : '#F5F5F5',
      },
      text: {
        textAlign: 'center',
        fontSize: 12,
        // White text on dark mode, black text otherwise.
        color: theme === 'dark' ? 'white' : 'black',
      },
    });
export default Switch;

