import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabsLayout() {
    return (
        <SafeAreaView className="flex-1 bg-primary" edges={["top"]}>
            <Tabs>
                <Tabs.Screen
                    name="index"
                    options={{
                        title: "Home",
                        headerShown: false,
                        tabBarIcon: ({ color }) => (
                            <Feather name="home" size={24} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="booked"
                    options={{
                        title: "Booked",
                        headerShown: false,
                        tabBarIcon: ({ color }) => (
                            <Feather name="calendar" size={24} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="booking"
                    options={{
                        title: "Booking",
                        headerShown: false,
                        tabBarIcon: ({ color }) => (
                            <Feather name="calendar" size={24} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="[classId]"
                    options={{
                        title: "Class",
                        headerShown: false,
                    }}
                />
            </Tabs>
        </SafeAreaView>
    );
}
