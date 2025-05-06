import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
    return (
        <Tabs>
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color }) => (
                        <Feather name="home" size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="booking"
                options={{
                    title: "Booking",
                }}
            />
            <Tabs.Screen
                name="booked"
                options={{
                    title: "Booked",
                }}
            />
        </Tabs>
    );
}
