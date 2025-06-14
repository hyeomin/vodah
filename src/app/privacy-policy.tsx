import AppText from "@/components/Apptext";
import { DownArrowIcon } from "@/components/icons/SvgIcons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { G } from "react-native-svg";

const PrivacyPolicyScreen = () => {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-primary" edges={["top"]}>
            <View className="flex-1 bg-background">
                <View className="header">
                    <Pressable
                        onPress={() => router.back()}
                        className="back-button bg-white rounded-full w-[35px] h-[35px] m-[20px] items-center justify-center absolute top-0 left-0 z-50"
                    >
                        <Svg width={13} height={13} viewBox="0 0 13 13">
                            <G transform="rotate(90 6.5 6.5)">
                                <DownArrowIcon />
                            </G>
                        </Svg>
                    </Pressable>
                    <AppText
                        weight="semibold"
                        className="text-[20px] p-[25px] text-center"
                    >
                        개인정보 이용약관
                    </AppText>
                </View>

                <ScrollView className="flex-1 p-[25px]">
                    <View className="gap-[20px]">
                        <View className="gap-[10px]">
                            <AppText weight="semibold" className="text-[18px]">
                                1. 수집하는 개인정보 항목
                            </AppText>
                            <AppText>
                                • 필수항목: 이름, 휴대전화번호{"\n"}• 선택항목:
                                이메일 주소
                            </AppText>
                        </View>

                        <View className="gap-[10px]">
                            <AppText weight="semibold" className="text-[18px]">
                                2. 개인정보의 수집 및 이용목적
                            </AppText>
                            <AppText>
                                • 예약 및 결제 서비스 제공{"\n"}• 예약 확인 및
                                안내
                                {"\n"}• 고객 문의 및 불만 처리{"\n"}• 서비스
                                이용에 따른 본인확인
                            </AppText>
                        </View>

                        <View className="gap-[10px]">
                            <AppText weight="semibold" className="text-[18px]">
                                3. 개인정보의 보유 및 이용기간
                            </AppText>
                            <AppText>
                                • 서비스 이용기간 동안 보유{"\n"}• 관련 법령에
                                따라 보존할 필요가 있는 경우 해당 기간 동안 보관
                            </AppText>
                        </View>

                        <View className="gap-[10px]">
                            <AppText weight="semibold" className="text-[18px]">
                                4. 개인정보의 제3자 제공
                            </AppText>
                            <AppText>
                                • 제공받는 자: 요가 클래스 제공자{"\n"}•
                                제공하는 항목: 이름, 휴대전화번호{"\n"}•
                                제공받는 자의 이용목적: 예약 확인 및 안내{"\n"}•
                                보유 및 이용기간: 서비스 이용기간 동안
                            </AppText>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default PrivacyPolicyScreen;
