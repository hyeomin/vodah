import AppText from "@/components/Apptext";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{
        email?: string;
        password?: string;
        general?: string;
    }>({});

    const validateForm = () => {
        const newErrors: { email?: string; password?: string } = {};

        if (!email) {
            newErrors.email = "이메일을 입력해주세요";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "유효한 이메일 주소를 입력해주세요";
        }

        if (!password) {
            newErrors.password = "비밀번호를 입력해주세요";
        } else if (password.length < 6) {
            newErrors.password = "비밀번호는 6자 이상이어야 합니다";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {
        if (validateForm()) {
            try {
                setIsLoading(true);
                // TODO: Implement login logic
                console.log("Login attempt with:", {
                    email,
                    password,
                    rememberMe,
                });
                // Simulate API call delay
                await new Promise((resolve) => setTimeout(resolve, 1000));

                // After successful login, you can navigate to the main app
                // router.replace("/(tabs)");
            } catch (error) {
                console.error("Login failed:", error);
                setErrors((prev) => ({
                    ...prev,
                    general: "로그인에 실패했습니다. 다시 시도해주세요.",
                }));
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <ScrollView
                    className="flex-1 px-6"
                    contentContainerStyle={{ flexGrow: 1 }}
                >
                    {/* Header */}
                    <View className="mt-12 mb-8">
                        <AppText
                            weight="bold"
                            className="text-[28px] text-accent mb-2"
                        >
                            로그인
                        </AppText>
                        <AppText className="text-textSecondary text-[16px]">
                            계정에 로그인하여 서비스를 이용해보세요
                        </AppText>
                    </View>

                    {/* Form */}
                    <View className="space-y-4">
                        {/* Email Input */}
                        <View className="space-y-2">
                            <AppText weight="semibold">이메일</AppText>
                            <TextInput
                                value={email}
                                onChangeText={setEmail}
                                placeholder="이메일을 입력해주세요"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                className="border border-tertiary rounded-[7px] h-[45px] px-[15px] text-[14px] text-black"
                            />
                            {errors.email && (
                                <AppText className="text-[#F25656] text-[12px]">
                                    {errors.email}
                                </AppText>
                            )}
                        </View>

                        {/* Password Input */}
                        <View className="space-y-2">
                            <AppText weight="semibold">비밀번호</AppText>
                            <TextInput
                                value={password}
                                onChangeText={setPassword}
                                placeholder="비밀번호를 입력해주세요"
                                secureTextEntry
                                className="border border-tertiary rounded-[7px] h-[45px] px-[15px] text-[14px] text-black"
                            />
                            {errors.password && (
                                <AppText className="text-[#F25656] text-[12px]">
                                    {errors.password}
                                </AppText>
                            )}
                        </View>

                        {/* Remember Me & Forgot Password */}
                        <View className="flex-row justify-between items-center">
                            <Pressable
                                onPress={() => setRememberMe(!rememberMe)}
                                className="flex-row items-center space-x-2"
                            >
                                <View
                                    className={`w-4 h-4 border rounded ${
                                        rememberMe
                                            ? "bg-primary border-primary"
                                            : "border-tertiary"
                                    }`}
                                />
                                <AppText className="text-textSecondary">
                                    로그인 상태 유지
                                </AppText>
                            </Pressable>
                            <Pressable
                                onPress={() => router.push("/forgot-password")}
                            >
                                <AppText className="text-linkBlue">
                                    비밀번호 찾기
                                </AppText>
                            </Pressable>
                        </View>

                        {/* Login Button */}
                        <Pressable
                            onPress={handleLogin}
                            disabled={isLoading}
                            className={`bg-primary rounded-[7px] h-[45px] items-center justify-center mt-6 ${
                                isLoading ? "opacity-70" : ""
                            }`}
                        >
                            <AppText
                                weight="semibold"
                                className="text-white text-[16px]"
                            >
                                {isLoading ? "로그인 중..." : "로그인"}
                            </AppText>
                        </Pressable>

                        {/* General Error Message */}
                        {errors.general && (
                            <AppText className="text-[#F25656] text-[12px] text-center mt-2">
                                {errors.general}
                            </AppText>
                        )}

                        {/* Sign Up Link */}
                        <View className="flex-row justify-center mt-4">
                            <AppText className="text-textSecondary">
                                계정이 없으신가요?{" "}
                            </AppText>
                            <Pressable onPress={() => router.push("/signup")}>
                                <AppText className="text-linkBlue">
                                    회원가입
                                </AppText>
                            </Pressable>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
