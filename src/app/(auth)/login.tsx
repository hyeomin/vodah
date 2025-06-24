import AppText from "@/components/Apptext";
import { DownArrowIcon } from "@/components/icons/SvgIcons";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Image, Pressable, View } from "react-native";
import Svg, { G } from "react-native-svg";

export default function LoginScreen() {
    const router = useRouter();
    const { user, signInWithKakao, signInWithApple, signInWithGoogle } =
        useAuth();
    const { redirect } = useLocalSearchParams<{ redirect?: string }>();

    // 로그인 성공 시 이전 페이지로 돌아가거나, 돌아갈 곳이 없으면 홈으로 이동
    useEffect(() => {
        if (user) {
            if (redirect || router.canGoBack()) {
                router.back(); // TEMP: 이전 페이지로 돌아가거나, 돌아갈 곳이 없으면 홈으로 이동
                // router.replace(redirect);
            } else {
                router.replace("/");
            }
        }
    }, [user, router, redirect]);

    return (
        <View className="flex-1">
            <Pressable
                onPress={() => router.back()}
                className="back-button bg-white rounded-full w-[35px] h-[35px] m-[20px] items-center justify-center absolute top-0"
                style={{ elevation: 2 }}
            >
                <Svg width={13} height={13} viewBox="0 0 13 13">
                    <G transform="rotate(90 6.5 6.5)">
                        <DownArrowIcon />
                    </G>
                </Svg>
            </Pressable>
            {/* moment 로고 */}
            <View className="w-full flex justify-center items-center mt-[60px] mb-[40px] h-[205px]">
                <AppText
                    fontFamily="Poppins"
                    className="text-[30px] leading-[45px] text-black"
                >
                    moment
                </AppText>
            </View>
            {/* 소셜 로그인 버튼들 */}
            <View className="w-full flex flex-col items-center gap-[15px]">
                {/* 카카오 */}
                <Pressable
                    className="flex-row items-center w-[325px] h-[47px] bg-[#FFEB00] rounded-[10px] border border-[#FFEB00]"
                    onPress={signInWithKakao}
                >
                    <Image
                        source={require("../../../assets/icons/kakao.png")}
                        className="w-[21px] h-[20px] ml-[13px] mr-[10px]"
                        resizeMode="contain"
                    />
                    <AppText
                        fontFamily="Pretendard-Bold"
                        weight="bold"
                        className="flex-1 text-center text-[14px] text-black"
                    >
                        카카오로 시작하기
                    </AppText>
                </Pressable>
                {/* 애플 */}
                <Pressable
                    className="flex-row items-center w-[325px] h-[47px] bg-white border border-black rounded-[10px]"
                    onPress={signInWithApple}
                >
                    <Image
                        source={require("../../../assets/icons/apple.png")}
                        className="w-[35px] h-[35px] ml-[8px] mr-[10px]"
                        resizeMode="contain"
                    />
                    <AppText
                        fontFamily="Pretendard-Bold"
                        weight="bold"
                        className="flex-1 text-center text-[14px] text-black"
                    >
                        Apple로 시작하기
                    </AppText>
                </Pressable>
                {/* 구글 */}
                <Pressable
                    className="flex-row items-center w-[325px] h-[47px] bg-white border border-border rounded-[10px]"
                    onPress={signInWithGoogle}
                >
                    <Image
                        source={require("../../../assets/icons/google.png")}
                        className="w-[25px] h-[25px] ml-[13px] mr-[10px]"
                        resizeMode="contain"
                    />
                    <AppText
                        fontFamily="Pretendard-Bold"
                        weight="bold"
                        className="flex-1 text-center text-[14px] text-black"
                    >
                        Google로 시작하기
                    </AppText>
                </Pressable>
            </View>
            {/* 하단 고객센터 */}
            <View className="w-full flex justify-center items-center py-[25px] bottom-0">
                <View className="absolute top-7 left-0 w-full h-[1px] bg-border" />
                <AppText
                    fontFamily="Pretendard"
                    className="top-7 text-[14px] text-black text-center"
                >
                    고객센터
                </AppText>
            </View>
        </View>
    );
}
