import SvgIcons from "@/components/icons/SvgIcons";
import AppText from "./Apptext";
import { Alert, Linking, Pressable, View, Text } from "react-native";
import { useAuth } from "@/contexts/AuthContext";

export default function Footer() {
    const { withdraw } = useAuth();

    const handleWithdrawal = () => {
        Alert.alert(
            "회원 탈퇴",
            "정말 탈퇴하시겠습니까?",
            [
                { text: "닫기", style: "cancel" },
                {
                    text: "예",
                    onPress: () => withdraw(),
                    style: "destructive",
                },
            ],
            { cancelable: true }
        );
    };

    const handlePrivacyPolicy = () => {
        Linking.openURL(
            "https://www.notion.so/215b0a6b258f8084a8a5f8e60be8d939?pvs=21"
        );
    };
    
    const handleCustomerService = () => {
        // 고객센터 링크가 정해지면 여기에 추가
        Alert.alert("준비 중", "고객센터 페이지가 준비 중입니다.");
    };

    return (
        <View className="w-full bg-[#EBEBF6] py-[30px] px-[20px] gap-[30px]">
            <View className="gap-[10px]">
                <View className="flex-row items-start gap-[5px] mb-0">
                    <Text className="font-bold text-textSecondary">
                        고객 센터 바로가기
                    </Text>
                    <Pressable
                        onPress={() =>
                            Linking.openURL(
                                "https://your-customer-center-url.com"
                            )
                        }
                        className="justify-center items-center"
                        hitSlop={8}
                    >
                        <SvgIcons.ExternalLinkIcon />
                    </Pressable>
                </View>
                <Text className="text-[12px] text-textSecondary">
                    운영시간 : 매일 오전 6시 ~ 오후 10시
                </Text>
            </View>
            <View className="gap-[1px]">
                <AppText className="text-[12px] text-textSecondary">
                    주식회사 모먼트 | 대표 박혜민 | 사업자번호 000-00-00000
                </AppText>
                <AppText className="text-[12px] text-textSecondary">
                    연락처 0502-1939-0086 | 통신판매업
                </AppText>
                <AppText className="text-[12px] text-textSecondary">
                    주소
                </AppText>
            </View>
            <View className="flex-row gap-[10px]">
                <Pressable onPress={handleWithdrawal}>
                    <AppText className="text-[12px] text-[#666666] underline">
                        회원 탈퇴
                    </AppText>
                </Pressable>
                <Pressable onPress={handlePrivacyPolicy}>
                    <AppText weight="bold" fontFamily="Inter-Bold" className="text-[12px] text-[#666666] underline">
                        개인정보 처리방침
                    </AppText>
                </Pressable>
            </View>
            <AppText
                fontFamily="Poppins"
                className="text-[20px] leading-[30px] text-black"
            >
                moment
            </AppText>
        </View>
    );
}
