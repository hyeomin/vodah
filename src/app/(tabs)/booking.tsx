import AppText from "@/components/Apptext";
import {
    CheckboxIcon,
    DownArrowIcon,
    MinusIcon,
    PlusIcon,
} from "@/components/SvgIcons";
import { useReservations } from "@/hooks/useReservations";
import { useSupabase } from "@/hooks/useSupabase";
import { useTimeSlots } from "@/hooks/useTimeSlots";
import { useYogaClasses } from "@/hooks/useYogaClasses";
import { enrichTimeSlots } from "@/utils/transformers";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    ScrollView,
    TextInput,
    View,
} from "react-native";
import Svg, { G } from "react-native-svg";

const BookingScreen = () => {
    const router = useRouter();
    const { classId, timeSlotId } = useLocalSearchParams<{
        classId: string;
        timeSlotId: string;
    }>();

    const [attendeeCount, setAttendeeCount] = useState(1);
    const [termsAgreed, setTermsAgreed] = useState(false);
    const [refundAgreed, setRefundAgreed] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [phoneError, setPhoneError] = useState(false);
    const [name, setName] = useState("");

    const { data: yogaClasses, loading: loadingClasses } = useYogaClasses();
    const { data: timeSlots = [], loading: loadingSlots } = useTimeSlots();
    const { data: reservations = [], loading: loadingRes } = useReservations();
    const { create: createUser, findOne } = useSupabase<{
        id: string;
        name: string;
        phone: string;
    }>("users");
    const { create: createReservation } = useSupabase<{
        id: string;
        timeslot_id: string;
        user_id: string;
        consents: { terms: boolean; refund: boolean };
    }>("reservations");

    const enrichedTimeSlots = useMemo(
        () => enrichTimeSlots(timeSlots, reservations),
        [timeSlots, reservations]
    );

    const selectedClass = useMemo(
        () => yogaClasses?.find((c) => c.id === classId),
        [yogaClasses, classId]
    );

    const selectedTimeSlot = useMemo(
        () => enrichedTimeSlots.find((ts) => ts.id === timeSlotId),
        [enrichedTimeSlots, timeSlotId]
    );

    const remainingCapacity = useMemo(() => {
        if (!selectedTimeSlot) return 0;
        return selectedTimeSlot.capacity - selectedTimeSlot.enrolledCount;
    }, [selectedTimeSlot]);

    const handleIncrement = () => {
        if (attendeeCount < remainingCapacity) {
            setAttendeeCount((prev) => prev + 1);
        }
    };

    const handleDecrement = () => {
        if (attendeeCount > 1) {
            setAttendeeCount((prev) => prev - 1);
        }
    };

    const handleBooking = async () => {
        // 1. Validate name and phone number
        if (!name.trim() || !phoneNumber.trim()) {
            Alert.alert("알림", "예약자명과 휴대전화 번호를 입력해주세요.");
            return;
        }

        // 2. Validate terms and refund agreement
        if (!termsAgreed || !refundAgreed) {
            Alert.alert("알림", "개인정보 및 취소환불 정책에 동의해주세요.");
            return;
        }

        try {
            // 3. Check if user exists with the same phone number
            const { data: existingUser, error: findError } = await findOne({
                column: "phone",
                value: phoneNumber.trim(),
            });

            if (findError) {
                console.error("User search error:", findError);
                Alert.alert(
                    "알림",
                    "예약자 정보 조회 중 오류가 발생했습니다. 다시 시도하거나 카카오 채널을 통해 문의해주세요."
                );
                return;
            }

            let userData;
            if (existingUser) {
                // Use existing user
                userData = existingUser;
            } else {
                // Create new user
                const { data: newUser, error: userError } = await createUser({
                    name: name.trim(),
                    phone: phoneNumber.trim(),
                });

                if (userError) {
                    console.error("User creation error:", userError);
                    Alert.alert(
                        "예약자 정보 저장 중 오류가 발생했습니다. 다시 시도하거나 카카오 채널을 통해 문의해주세요."
                    );
                    return;
                }
                userData = newUser;
            }

            // 4. Create reservation record
            const { error: reservationError } = await createReservation({
                timeslot_id: timeSlotId,
                user_id: userData.id,
                consents: {
                    terms: termsAgreed,
                    refund: refundAgreed,
                },
            });

            if (reservationError) {
                console.error("Reservation creation error:", reservationError);
                Alert.alert(
                    "예약 정보 저장 중 오류가 발생했습니다. 다시 시도하거나 카카오 채널을 통해 문의해주세요."
                );
                return;
            }

            // 5. Navigate to booked page
            router.push("/booked");
        } catch (error) {
            console.error("Booking error:", error);
            Alert.alert(
                "예약 처리 중 오류가 발생했습니다. 다시 시도하거나 카카오 채널을 통해 문의해주세요."
            );
        }
    };

    const isAnyLoading = loadingClasses || loadingSlots || loadingRes;

    const isFormValid = useMemo(() => {
        return name.trim() && phoneNumber.trim() && termsAgreed && refundAgreed;
    }, [name, phoneNumber, termsAgreed, refundAgreed]);

    const totalPrice = useMemo(() => {
        if (!selectedTimeSlot) return 0;
        return selectedTimeSlot.price * attendeeCount;
    }, [selectedTimeSlot, attendeeCount]);

    if (isAnyLoading) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (!selectedClass || !selectedTimeSlot) {
        return (
            <View className="flex-1 items-center justify-center">
                <AppText>예약 정보를 찾을 수 없습니다.</AppText>
            </View>
        );
    }

    return (
        <ScrollView className="bg-background">
            <Pressable
                onPress={() => {
                    router.push({
                        pathname: "/[classId]",
                        params: { classId },
                    });
                }}
                className="back-button bg-white rounded-full w-[35px] h-[35px] m-[20px] items-center justify-center absolute top-0 left-0 z-50"
            >
                <Svg width={13} height={13} viewBox="0 0 13 13">
                    <G transform="rotate(90 6.5 6.5)">
                        <DownArrowIcon />
                    </G>
                </Svg>
            </Pressable>
            {/* Booking Details */}
            <View className="booking-info-container p-[25px] gap-[20px] border-b border-tertiary">
                <View className="self-center justify-center items-center">
                    <AppText
                        weight="semibold"
                        className="title text-[18px] flex-shrink"
                    >
                        예약 정보
                    </AppText>
                </View>
                <View className="booking-detail gap-[10px]">
                    <View className="single-info flex-row justify-between">
                        <AppText className="text-tertiary">수업명</AppText>
                        <AppText>{selectedClass.title}</AppText>
                    </View>
                    <View className="single-info flex-row justify-between">
                        <AppText className="text-tertiary">위치</AppText>
                        <AppText>
                            {selectedClass.location?.roadAddress ||
                                "위치 정보 없음"}
                        </AppText>
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
                        <View className="dot w-[5px] h-[5px] rounded-full bg-danger"></View>
                    </View>
                    <TextInput
                        placeholder="이름을 입력해주세요"
                        placeholderTextColor={"gray"}
                        className="input-field border border-tertiary rounded-[7px] h-[45px] px-[15px] text-[15px]"
                        value={name}
                        onChangeText={setName}
                    />
                </View>
                <View className="user-phone-container gap-[10px]">
                    <View className="title flex-row gap-[5px]">
                        <AppText>휴대전화</AppText>
                        <View className="dot w-[5px] h-[5px] rounded-full bg-danger"></View>
                    </View>
                    <TextInput
                        placeholder="휴대전화 번호를 입력해주세요"
                        placeholderTextColor={"gray"}
                        className="input-field border border-tertiary rounded-[7px] h-[45px] px-[15px] text-[15px]"
                        value={phoneNumber}
                        onChangeText={(text) => {
                            // Remove all non-digit characters
                            const cleaned = text.replace(/[^0-9]/g, "");

                            // Format the number with hyphens
                            let formatted = cleaned;
                            if (cleaned.length > 3) {
                                formatted =
                                    cleaned.slice(0, 3) +
                                    "-" +
                                    cleaned.slice(3);
                            }
                            if (cleaned.length > 7) {
                                formatted =
                                    formatted.slice(0, 8) +
                                    "-" +
                                    formatted.slice(8);
                            }

                            setPhoneNumber(formatted);
                        }}
                        onBlur={() => {
                            const cleaned = phoneNumber.replace(/[^0-9]/g, "");
                            if (cleaned.length === 0) {
                                setPhoneError(false);
                            } else {
                                setPhoneError(cleaned.length !== 11);
                            }
                        }}
                        keyboardType="numeric"
                        maxLength={13} // 11 digits + 2 hyphens
                    />
                    {phoneError && (
                        <AppText className="text-danger text-[12px] px-[3px]">
                            휴대전화 번호 11자리를 입력해주세요
                        </AppText>
                    )}
                </View>
            </View>

            {/* Attendee Count */}
            <View className="attendee-count-container flex-row p-[25px] justify-between items-center border-b border-tertiary">
                <AppText weight="semibold" className="title text-[18px]">
                    인원 선택
                </AppText>
                <View className="count-selector flex-row w-[130px] gap-[15px] justify-between px-[10px] py-[5px] items-center border border-tertiary rounded-[7px]">
                    <Pressable
                        onPress={handleDecrement}
                        className="w-[30px] h-[30px] items-center justify-center "
                    >
                        <MinusIcon />
                    </Pressable>
                    <AppText className="count text-[15px]">
                        {attendeeCount}
                    </AppText>
                    <Pressable
                        onPress={handleIncrement}
                        className="w-[30px] h-[30px] items-center justify-center"
                    >
                        <PlusIcon />
                    </Pressable>
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
                            {`${totalPrice.toLocaleString()}원`}
                        </AppText>
                        <Svg width={13} height={13} viewBox="0 0 13 13">
                            <G transform="rotate(180 6.5 6.5)">
                                <DownArrowIcon />
                            </G>
                        </Svg>
                    </View>
                </View>
                <View className="price-details flex-row justify-between">
                    <AppText>주문 금액 X {attendeeCount}명</AppText>
                    <AppText>{totalPrice.toLocaleString()}원</AppText>
                </View>
            </View>

            {/* Payment Method */}
            <View className="notice-container p-[25px] gap-[20px] border-b border-tertiary">
                <AppText weight="semibold" className="title text-[18px]">
                    예약 안내
                </AppText>
                <View className="notice-content gap-[10px]">
                    <View className="notice-item flex-row items-center gap-[10px]">
                        <View className="dot w-[5px] h-[5px] rounded-full bg-tertiary"></View>
                        <AppText>
                            요가 클래스와 컨택 후 자리 확인이 필요합니다.
                        </AppText>
                    </View>
                    <View className="notice-item flex-row items-center gap-[10px]">
                        <View className="dot w-[5px] h-[5px] rounded-full bg-tertiary"></View>
                        <AppText>
                            자리 확인 후 입금 계좌를 카카오톡으로
                            안내해드립니다.
                        </AppText>
                    </View>
                </View>
            </View>

            {/* Terms Agreement */}
            <View className="terms-agreement-container p-[25px] gap-[20px] border-b border-tertiary">
                <View className="refund-terms bg-white border border-border rounded-[10px] p-[20px] gap-[10px]">
                    <AppText weight="semibold">환불 규정</AppText>
                    <View className="refund-policy-list gap-[5px]">
                        <View className="policy-item flex-row items-center gap-[10px]">
                            <View className="dot w-[5px] h-[5px] rounded-full bg-tertiary"></View>
                            <AppText>이용일 10일 전 : 100% 환불</AppText>
                        </View>
                        <View className="policy-item flex-row items-center gap-[10px]">
                            <View className="dot w-[5px] h-[5px] rounded-full bg-tertiary"></View>
                            <AppText>이용일 9일 전 ~ 3일 전 : 50% 환불</AppText>
                        </View>
                        <View className="policy-item flex-row items-center gap-[10px]">
                            <View className="dot w-[5px] h-[5px] rounded-full bg-tertiary"></View>
                            <AppText>이용일 2일 전 : 환불 불가</AppText>
                        </View>
                    </View>
                </View>
                <View className="checkbox-container gap-[15px] px-[10px]">
                    <View className="flex-row justify-between">
                        <Pressable
                            className="single-checkbox flex-row gap-[7px]"
                            onPress={() => setTermsAgreed(!termsAgreed)}
                        >
                            <CheckboxIcon checked={termsAgreed} />
                            <AppText>개인정보 제3자 제공에 동의합니다.</AppText>
                        </Pressable>

                        <Pressable
                            onPress={() => router.push("/privacy-policy")}
                        >
                            <Svg width={13} height={13} viewBox="0 0 13 13">
                                <G transform="rotate(270 6.5 6.5)">
                                    <DownArrowIcon />
                                </G>
                            </Svg>
                        </Pressable>
                    </View>

                    <Pressable
                        className="single-checkbox flex-row gap-[7px]"
                        onPress={() => setRefundAgreed(!refundAgreed)}
                    >
                        <CheckboxIcon checked={refundAgreed} />
                        <AppText>취소 및 환불 정책에 동의합니다.</AppText>
                    </Pressable>
                </View>
            </View>

            {/* CTA Button */}
            <View className="cta-button-container p-[25px]">
                <Pressable
                    onPress={handleBooking}
                    className={`cta-button items-center justify-center flex-1 rounded-[10px] p-[10px] h-[50px] ${
                        isFormValid ? "bg-primary" : "bg-disabled"
                    }`}
                >
                    <AppText
                        weight="semibold"
                        className="text-[16px] text-white"
                    >
                        {`${totalPrice.toLocaleString()}원 예약하기`}
                    </AppText>
                </Pressable>
            </View>
        </ScrollView>
    );
};

export default BookingScreen;
