import { GlobalLoadingOverlay } from "@/components/GlobalLoadingOverlay";
import { AuthProvider } from "@/contexts/AuthContext";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../../global.css";

export default function RootLayout() {
    return (
        <AuthProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <Stack
                    screenOptions={{
                        gestureEnabled: true,
                        gestureDirection: "horizontal",
                        fullScreenGestureEnabled: true,
                    }}
                >
                    <Stack.Screen
                        name="(tabs)"
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="(auth)"
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="class"
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="privacy-policy"
                        options={{ headerShown: false }}
                    />
                </Stack>
            </GestureHandlerRootView>
            <GlobalLoadingOverlay />
        </AuthProvider>
    );
}
