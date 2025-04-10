import { IconSymbol } from "@/components/ui/IconSymbol";
import Stack from "@/components/ui/Stack";
import TouchableBounce from "@/components/ui/TouchableBounce";
import { Link } from "expo-router";
import { Platform, SafeAreaView, StyleSheet, Text, View } from "react-native";

import ThemeProvider, { useTheme } from "@/components/ui/ThemeProvider";
import "@/global.css";
import LightMode from "./lightmode";

export const unstable_settings = {
  initialRouteName: "index",
};

export { ErrorBoundary } from "expo-router";

// Create a separate component that uses the theme
function AppContent() {
  // This component is a child of ThemeProvider, so useTheme works here
  const { theme } = useTheme();
  if (Platform.OS === 'web') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme === 'dark' ? '#1C1C1C' : '#EFEFEF' }}>
        <Stack
          screenOptions={{
            headerShown: true,
            title: "",
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              headerStyle: {
                backgroundColor: theme === 'dark' ? '#1C1C1E' : '#F2F2F7',
              },
              header: () => (
                <View
                  style={[
                    styles.header,
                    { backgroundColor: theme === 'dark' ? '#1C1C1C' : '#EFEFEF' }
                  ]}
                >
                  <View style={styles.headerLeft}>
                    <Link href="/settings" asChild>
                      <TouchableBounce sensory>
                        <IconSymbol name="gear" color={theme === 'light' ? 'black' : 'white'} />
                      </TouchableBounce>
                    </Link>
                  </View>
                  <View style={styles.headerCenter}>
                    <Link href="/" asChild dismissTo>
                      <TouchableBounce sensory>
                          <Text style={[styles.titleText, { color: theme === 'dark' ? '#FFFFFF' : '#000000' }]}>
                            DIY AI
                          </Text>
                      </TouchableBounce>
                    </Link>
                  </View>
                  <View style={styles.headerRight}>
                    <LightMode/>
                  </View>
                </View>
              ),
            }}
          />
        </Stack>
      </SafeAreaView>
    );
  }
  else if (Platform.OS === 'ios'){
    console.log('ios')
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme === 'dark' ? '#1C1C1C' : '#EFEFEF' }}>
        <Stack
          screenOptions={{
            headerShown: true,
            title: "",
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              headerStyle: {
                backgroundColor: theme === 'dark' ? '#1C1C1E' : '#F2F2F7',
              },
              header: () => (
                <View
                  style={[
                    styles.header,
                    { backgroundColor: theme === 'dark' ? '#1C1C1C' : '#EFEFEF' }
                  ]}
                >
                  <View style={styles.headerLeft}>
                    <Link href="/settings" asChild>
                      <TouchableBounce sensory>
                        <IconSymbol name="gear" color={theme === 'light' ? 'black' : 'white'} />
                      </TouchableBounce>
                    </Link>
                  </View>
                  <View style={styles.headerCenter}>
                    <Text style={[styles.titleText, { color: theme === 'dark' ? '#FFFFFF' : '#000000' }]}>
                      DIY AI
                    </Text>
                  </View>
                  <View style={styles.headerRight}>
                    <LightMode/>
                  </View>
                </View>
              ),
            }}
          />
        </Stack>
    </SafeAreaView>
    )
  }
}

// Main layout just provides the context
export default function Layout() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  headerLeft: {
    flex: 1,
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'row',
  },
  headerCenter: {
    flex: 2,
    alignItems: 'center',
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  titleText: {
    fontSize: 17,
    fontWeight: '600',
  }
});
