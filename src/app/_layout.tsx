import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../../global.css";
import * as Font from "expo-font";
import { useEffect } from "react";
import { useState } from "react";

export default function RootLayout() {
    const [fontsLoaded, setFontsLoaded] = useState(false);

    useEffect(() => {
        (async () => {
            await Font.loadAsync({
                Poppins: require("../../assets/fonts/Poppins/Poppins-Regular.ttf"),
                Pretendard: require("../../assets/fonts/Pretendard/Pretendard-Regular.ttf"),
            });
            setFontsLoaded(true);
        })();
    }, []);

    if (!fontsLoaded) return null;

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Stack
                screenOptions={{
                    gestureEnabled: true,
                    gestureDirection: "horizontal",
                    fullScreenGestureEnabled: true,
                }}
            >
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
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
    );
}
