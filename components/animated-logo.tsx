"use client";

import React, { useEffect } from "react";
import {
  Image,
  Keyboard,
  Platform,
  useWindowDimensions
} from "react-native";

import Animated from "react-native-reanimated";

import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "./ui/ThemeProvider";

function useKeyboardOpen() {
  const [keyboardOpen, setKeyboardOpen] = React.useState(false);
  useEffect(() => {
    const off = Keyboard.addListener("keyboardWillShow", () => {
      setKeyboardOpen(true);
    });
    const off2 = Keyboard.addListener("keyboardWillHide", () => {
      setKeyboardOpen(false);
    });
    return () => {
      off.remove();
      off2.remove();
    };
  }, []);

  return keyboardOpen;
}

export function AnimatedLogo() {
  const isOpen = useKeyboardOpen();
  const translateY = useSharedValue(0);
  const { height } = useWindowDimensions();
  useEffect(() => {
    translateY.value = withTiming(isOpen ? height * -0.25 : 0, {
      duration: 200,
    });
  }, [isOpen, translateY, height]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const { theme } = useTheme();
  if (Platform.OS === "web") {
  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
        },
        animatedStyle,
      ]}
    >
      <Image
        source={
          theme === "light"
            ? require("@/assets/images/logo_light.png")
            : require("@/assets/images/logo_dark.png")
        }
        style={{ width: 400, height: 50, opacity: 0.3 }}
      />
    </Animated.View>
  );
  }
  else {
    return (
      <Animated.View
      style={[
        {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
        },
        animatedStyle,
      ]}
    >
      <Image
        source={
          theme === "light"
            ? require("@/assets/images/logo_light.png")
            : require("@/assets/images/logo_dark.png")
        }
        style={{ width: 400, height: 50, opacity: 0.3 }}
      />
    </Animated.View>
    );
  }
}