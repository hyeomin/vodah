import { Tabs } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import TabIcon from "../../components/icons/TabIcon";
import { useLoginRequired } from "@/hooks/useLoginRequired";
import { LoginRequiredModal } from "@/components/LoginRequiredModal";

export default function TabsLayout() {
    const { isModalVisible, hideModal, checkLoginRequired } = useLoginRequired();

    return (
        <SafeAreaView className="flex-1 bg-primary" edges={["top"]}>
            <Tabs
                screenOptions={{
                    tabBarStyle: {
                        height: 90,
                    },
                    tabBarItemStyle: {
                        paddingVertical: 5,
                        alignItems: "center",
                    },
                    tabBarActiveTintColor: "#8889BD",
                    tabBarInactiveTintColor: "#000000",
                    tabBarLabelStyle: {
                        color: "#8889BD",
                    },
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        title: "홈",
                        headerShown: false,
                        tabBarIcon: ({ color }) => (
                            <TabIcon color={color} size={22} name="home" />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="booked"
                    options={{
                        title: "나의 수련",
                        headerShown: false,
                        tabBarIcon: ({ color }) => (
                            <TabIcon color={color} size={22} name="calendar" />
                        ),
                    }}
                    listeners={{
                        tabPress: (e) => {
                            if (!checkLoginRequired()) {
                                e.preventDefault();
                            }
                        }
                    }}
                />
            </Tabs>
            <LoginRequiredModal 
                isVisible={isModalVisible}
                onClose={hideModal}
            />
        </SafeAreaView>
    );
}
