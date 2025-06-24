import { GlobalLoadingOverlay } from "@/components/GlobalLoadingOverlay";
import { AuthProvider } from "@/contexts/AuthContext";
import * as Font from "expo-font";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../../global.css";

export default function RootLayout() {
    const [fontsLoaded, setFontsLoaded] = useState(false);

    useEffect(() => {
        (async () => {
            await Font.loadAsync({
                Poppins: require("../../assets/fonts/Poppins/Poppins-Regular.ttf"),
                "Pretendard-Thin": require("../../assets/fonts/Pretendard/Pretendard-Thin.ttf"),
                "Pretendard-ExtraLight": require("../../assets/fonts/Pretendard/Pretendard-ExtraLight.ttf"),
                "Pretendard-Light": require("../../assets/fonts/Pretendard/Pretendard-Light.ttf"),
                "Pretendard-Regular": require("../../assets/fonts/Pretendard/Pretendard-Regular.ttf"),
                "Pretendard-Medium": require("../../assets/fonts/Pretendard/Pretendard-Medium.ttf"),
                "Pretendard-SemiBold": require("../../assets/fonts/Pretendard/Pretendard-SemiBold.ttf"),
                "Pretendard-Bold": require("../../assets/fonts/Pretendard/Pretendard-Bold.ttf"),
                "Pretendard-ExtraBold": require("../../assets/fonts/Pretendard/Pretendard-ExtraBold.ttf"),
                "Pretendard-Black": require("../../assets/fonts/Pretendard/Pretendard-Black.ttf"),
            });
            setFontsLoaded(true);
        })();
    }, []);

    if (!fontsLoaded) return null;

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
