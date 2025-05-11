import AppText from "@/components/Apptext";
import { DownArrowIcon } from "@/components/SvgIcons";
import { dummyYogaClasses, enrichedDummyTimeSlots } from "@/dummyData";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, TextInput, View } from "react-native";
import Svg, { G } from "react-native-svg";

const BookingScreen = () => {
    const { classId, timeSlotId } = useLocalSearchParams<{
        classId: string;
        timeSlotId: string;
    }>();

    // Fallback to dummy data if params are not provided
    const selectedClass = classId
        ? dummyYogaClasses.find((c) => c.id === classId)
        : dummyYogaClasses[0];

    const selectedTimeSlot = timeSlotId
        ? enrichedDummyTimeSlots.find((ts) => ts.id === timeSlotId)
        : enrichedDummyTimeSlots.find((ts) => ts.classId === selectedClass?.id);

    if (!selectedClass || !selectedTimeSlot) {
        return (
            <View className="flex-1 items-center justify-center">
                <AppText>예약 정보를 찾을 수 없습니다.</AppText>
            </View>
        );
    }

    return (
        <ScrollView className="bg-background">
            {/* Booking Details */}
            <View className="booking-info-container p-[25px] gap-[20px] border-b border-tertiary">
                <AppText weight="semibold" className="title text-[18px]">
                    예약 정보
                </AppText>
                <View className="booking-detail gap-[10px]">
                    <View className="single-info flex-row justify-between">
                        <AppText className="text-tertiary">수업명</AppText>
                        <AppText>{selectedClass.title}</AppText>
                    </View>
                    <View className="single-info flex-row justify-between">
                        <AppText className="text-tertiary">위치</AppText>
                        <AppText>{selectedClass.location?.fullAddress}</AppText>
                    </View>
                    <View className="single-info flex-row justify-between">
                        <AppText className="text-tertiary">날짜</AppText>
                        <AppText>
                            {selectedTimeSlot.startTime.toLocaleDateString(
                                "ko-KR",
                                {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                }
                            )}
                        </AppText>
                    </View>
                    <View className="single-info flex-row justify-between">
                        <AppText className="text-tertiary">시간</AppText>
                        <AppText>{`${selectedTimeSlot.startTime.toLocaleTimeString(
                            "ko-KR",
                            { hour: "2-digit", minute: "2-digit" }
                        )} - ${selectedTimeSlot.endTime.toLocaleTimeString(
                            "ko-KR",
                            { hour: "2-digit", minute: "2-digit" }
                        )}`}</AppText>
                    </View>
                </View>
            </View>

            {/* Booking User Details */}
            <View className="booking-user-details p-[25px] gap-[20px] border-b border-tertiary">
                <AppText weight="semibold" className="title text-[18px]">
                    예약자 정보
                </AppText>
                <View className="user-name-container gap-[10px]">
                    <View className="title flex-row gap-[5px]">
                        <AppText>예약자명</AppText>
                        <View className="dot w-[5px] h-[5px] rounded-full bg-[#F25656]"></View>
                    </View>
                    <TextInput
                        placeholder="이름을 입력해주세요"
                        className="input-field border border-tertiary rounded-[7px] h-[45px] px-[15px] text-[14px] text-tertiary"
                    />
                </View>
                <View className="user-phone-container gap-[10px]">
                    <View className="title flex-row gap-[5px]">
                        <AppText>휴대전화</AppText>
                        <View className="dot w-[5px] h-[5px] rounded-full bg-[#F25656]"></View>
                    </View>
                    <TextInput
                        placeholder="휴대전화 번호를 입력해주세요"
                        className="input-field border border-tertiary rounded-[7px] h-[45px] px-[15px] text-[14px] text-tertiary"
                    />
                </View>
            </View>

            {/* Attendee Count */}
            <View className="attendee-count-container flex-row p-[25px] justify-between items-center border-b border-tertiary">
                <AppText weight="semibold" className="title text-[18px]">
                    인원 선택
                </AppText>
                <View className="count-selector flex-row gap-[25px] justify-between px-[25px] py-[12px] border border-tertiary rounded-[7px]">
                    <AppText className="plus-button">+</AppText>
                    <AppText className="count">1</AppText>
                    <AppText className="minus-button">-</AppText>
                </View>
            </View>

            {/* Final Price */}
            <View className="final-price-container  p-[25px] gap-[20px] border-b border-tertiary">
                <View className="price-summary flex-row justify-between">
                    <AppText weight="semibold" className="title text-[18px]">
                        최종 결제 금액
                    </AppText>
                    <View className="right-container flex-row items-center gap-[10px]">
                        <AppText weight="semibold" className="text-[18px]">
                            {`${selectedTimeSlot.price.toLocaleString()}원`}
                        </AppText>
                        <Svg width={13} height={13} viewBox="0 0 13 13">
                            <G transform="rotate(180 6.5 6.5)">
                                <DownArrowIcon />
                            </G>
                        </Svg>
                    </View>
                </View>
                <View className="price-details flex-row justify-between">
                    <AppText>주문 금액 X 1명</AppText>
                    <AppText>
                        {selectedTimeSlot.price.toLocaleString()}원
                    </AppText>
                </View>
            </View>

            {/* Payment Method */}
            <View className="payment-method-container p-[25px] gap-[20px] border-b border-tertiary">
                <AppText weight="semibold" className="title text-[18px]">
                    결제 수단
                </AppText>
            </View>

            {/* Terms Agreement */}
            <View className="terms-agreement-container p-[25px] gap-[20px] border-b border-tertiary">
                <View className="refund-terms bg-white border border-border rounded-[10px] p-[20px] gap-[10px]">
                    <AppText weight="semibold">환불 규정</AppText>
                    <View className="refund-policy-list gap-[10px]">
                        <View className="policy-item flex-row items-center gap-[10px]">
                            <View className="dot w-[5px] h-[5px] rounded-full bg-tertiary"></View>
                            <AppText>이용일 10일 전 : 100% 환불</AppText>
                        </View>
                        <View className="policy-item flex-row items-center gap-[10px]">
                            <View className="dot w-[5px] h-[5px] rounded-full bg-tertiary"></View>
                            <AppText>이용일 3일 전~9일 전: 50% 환불</AppText>
                        </View>
                        <View className="policy-item flex-row items-center gap-[10px]">
                            <View className="dot w-[5px] h-[5px] rounded-full bg-tertiary"></View>
                            <AppText>이용일 2일 전 : 환불 불가</AppText>
                        </View>
                    </View>
                </View>
                <View className="checkbox-container gap-[15px] px-[10px]">
                    <View className="single-checkbox flex-row gap-[7px]">
                        <View className="checkbox w-[15px] h-[15px] rounded-[3px] bg-tertiary"></View>
                        <AppText>이용약관에 동의합니다.</AppText>
                    </View>
                    <View className="single-checkbox flex-row gap-[7px]">
                        <View className="checkbox w-[15px] h-[15px] rounded-[3px] bg-tertiary"></View>
                        <AppText>이용약관에 동의합니다.</AppText>
                    </View>
                </View>
            </View>

            {/* CTA Button */}
            <View className="cta-button-container p-[25px]">
                <View className="cta-button bg-primary items-center justify-center flex-1 rounded-[10px] p-[10px] h-[50px]">
                    <AppText
                        weight="semibold"
                        className="text-[16px] text-white"
                    >
                        예약하기
                    </AppText>
                </View>
            </View>
        </ScrollView>
    );
};

export default BookingScreen;
