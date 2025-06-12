import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ClassLayout() {
  return (
    <SafeAreaView className="flex-1 bg-primary" edges={["top"]}>
      <Stack 
        screenOptions={{
          headerShown: false,
        }}
      />
    </SafeAreaView>
  );
} 