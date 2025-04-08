import { StyleProp, View, ViewStyle } from "react-native";
// Media queries for web layout.

export function ChatContainer({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View
      style={[
        {
          flex: 1,
          alignItems: "stretch",
          marginTop: 20,
        },
        // @ts-expect-error
        process.env.EXPO_OS === "web" && { maxHeight: "100vh" },
      ]}
    >
      <View style={[{ flex: 1, flexGrow: 1 }, style]}>{children}</View>
    </View>
  );
}
