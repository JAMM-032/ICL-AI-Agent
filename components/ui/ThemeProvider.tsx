import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as RNTheme,
  Theme
} from "@react-navigation/native";
import { createContext, useContext, useState } from "react";
import { useColorScheme } from "react-native";


// Use exact native P3 colors and equivalents on Android/web.
// This lines up well with React Navigation.
interface ThemeContextType {
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
}

// Light theme definition
const BaconDefaultTheme: Theme = {
  dark: false,
  colors: {
    primary: '#007AFF',               // A system blue-like color
    background: '#F2F2F7',              // A light grey background (iOS grouped background)
    card: '#FFFFFF',                  // White background for cards
    text: '#000000',                  // Black text
    border: '#C7C7CC',                // A light gray border
    notification: '#FF3B30',          // A red color for notifications
  },
  fonts: DefaultTheme.fonts,
};

// Dark theme definition
const BaconDarkTheme: Theme = {
  dark: true,
  colors: {
    ...BaconDefaultTheme.colors,      // start with the light theme colors
    background: '#151314',            // Change background to black for dark mode
    card: '#1C1C1E',                  // A dark gray for cards
    text: '#FFFFFF',                  // White text for contrast
    // You can override other color values if needed to better suit a dark appearance
  },
  fonts: DarkTheme.fonts,
};
// Provide a default value
const defaultThemeContext: ThemeContextType = {
  theme: 'dark',
  setTheme: () => {},
};

const ThemeContext = createContext(defaultThemeContext);

export default function ThemeProvider(props: { children: React.ReactNode }) {
  const systemTheme = useColorScheme();
  const [theme, setTheme] = useState<string>(systemTheme || 'dark');
  
  // Pass the actual setState function directly
  const contextValue = { 
    theme, 
    setTheme 
  };
  // useEffect(() => {
  //   setTheme(systemTheme || 'dark');
  // }, [systemTheme]);
  // Determine which theme to use
  const themeValue = theme === "dark" ? BaconDarkTheme : BaconDefaultTheme;
    return (
      <ThemeContext.Provider value={contextValue}>
        <RNTheme value={themeValue}>
          {props.children}
        </RNTheme>
      </ThemeContext.Provider>
    );
  
}

export const useTheme = () => useContext(ThemeContext);
