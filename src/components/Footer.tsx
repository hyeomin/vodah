import SvgIcons from "@/components/icons/SvgIcons";
import { Linking, Pressable, Text, View } from "react-native";
import AppText from "./Apptext";

export default function Footer() {
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
            <AppText
                fontFamily="Poppins"
                className="text-[20px] leading-[30px] text-black"
            >
                moment
            </AppText>
        </View>
    );
}
