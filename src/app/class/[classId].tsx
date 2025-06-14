import AppText from "@/components/Apptext";
import FormattedTimeSlots from "@/components/FormattedTimeSlots";
import {
    AddressIcon,
    CalendarIcon,
    ContactIcon,
    DownArrowIcon,
} from "@/components/icons/SvgIcons";
import TimeSlotCard from "@/components/TimeSlotCard";
import { useInstructors } from "@/hooks/useInstructors";
import { useReservations } from "@/hooks/useReservations";
import { useTimeSlots } from "@/hooks/useTimeSlots";
import { useYogaClasses } from "@/hooks/useYogaClasses";
import {
    DIFFICULTY_DISPLAY_NAMES,
    LOCATION_DISPLAY_NAMES,
} from "@/types/types";
import { enrichTimeSlots } from "@/utils/transformers";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    Linking,
    Pressable,
    ScrollView,
    TouchableOpacity,
    View,
} from "react-native";
import Svg, { G } from "react-native-svg";

export default function ClassDetails() {
    const { classId } = useLocalSearchParams<{ classId: string }>();
    const router = useRouter();
    const [selectedTimeSlotId, setSelectedTimeSlotId] = useState<string | null>(
        null
    );
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const screenWidth = Dimensions.get("window").width;

    const {
        data: yogaClasses,
        loading: loadingClasses,
        error: classesError,
    } = useYogaClasses();
    const { data: timeSlots = [], loading: loadingSlots } = useTimeSlots();
    const { data: reservations = [], loading: loadingRes } = useReservations();
    const { data: instructors = [], loading: loadingInstructors } =
        useInstructors();

    const enrichedTimeSlots = useMemo(
        () => enrichTimeSlots(timeSlots || [], reservations || []),
        [timeSlots, reservations]
    );

    const yogaClass = yogaClasses?.find((yc) => yc.id === classId);

    const isAnyLoading =
        loadingClasses || loadingSlots || loadingRes || loadingInstructors;

    if (isAnyLoading) {
        return (
            <View className="flex-1 bg-background items-center justify-center">
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (classesError || !yogaClass) {
        return (
            <View className="flex-1 bg-background items-center justify-center">
                <AppText>수업을 찾을 수 없습니다.</AppText>
            </View>
        );
    }

    const instructor = instructors?.find(
        (i) => i.id === yogaClass.instructorId
    ) || {
        name: "Unknown Instructor",
        bio: "No bio available",
        instagram: null,
    };

    const tags = (yogaClass.tagIds || []).map((tagId) => ({
        id: tagId,
        name: tagId, // Replace with actual tag data
    }));

    const handleScroll = (event: any) => {
        const contentOffset = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffset / screenWidth);
        setCurrentImageIndex(index);
    };

    const openExternalLink = async () => {
        if (!yogaClass.detailPostUrl) {
            Alert.alert("알림", "상세 정보 링크가 없습니다.");
            return;
        }
        const supported = await Linking.canOpenURL(yogaClass.detailPostUrl);

        if (supported) {
            await Linking.openURL(yogaClass.detailPostUrl);
        } else {
            Alert.alert("알림", "링크를 열 수 없습니다.");
        }
    };

    const locationInfo = yogaClass.studio?.location || yogaClass.location;

    return (
        yogaClass && (
            <ScrollView className="bg-background">
                {/* Header Image */}
                <View className="h-[230px] bg-gray-300">
                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                    >
                        {(yogaClass.imageUrls || []).map((url, index) => (
                            <View key={index} style={{ width: screenWidth }}>
                                <Image
                                    source={{ uri: url }}
                                    className="w-full h-full"
                                    resizeMode="cover"
                                />
                            </View>
                        ))}
                    </ScrollView>
                    <Pressable
                        onPress={() => router.back()}
                        className="back-button bg-white rounded-full w-[35px] h-[35px] m-[20px] items-center justify-center absolute top-0"
                    >
                        <Svg width={13} height={13} viewBox="0 0 13 13">
                            <G transform="rotate(90 6.5 6.5)">
                                <DownArrowIcon />
                            </G>
                        </Svg>
                    </Pressable>
                    <View className="bottom-of-image flex-row w-full justify-between items-center pl-[20px] py-[20px] absolute bottom-0">
                        {/* Container to maintain left space when key-tag is hidden, preventing page-number from shifting left */}
                        <View className="flex-1">
                            {(() => {
                                const location =
                                    LOCATION_DISPLAY_NAMES[yogaClass.isIndoor];
                                const difficulty =
                                    DIFFICULTY_DISPLAY_NAMES[
                                        yogaClass.difficulty
                                    ];

                                if (!location && !difficulty) return null;

                                return (
                                    <View className="key-tag-container bg-white rounded-[5px] p-[5px]">
                                        <AppText className="text-[13px]">
                                            {!location
                                                ? difficulty
                                                : !difficulty
                                                ? location
                                                : `${location} · ${difficulty}`}
                                        </AppText>
                                    </View>
                                );
                            })()}
                        </View>
                        <View className="class-title-container w-[70px] p-[5px] justify-center items-center gap-[10px] rounded-l-[10px] bg-black/30">
                            <AppText className="page-number text-[13px] text-white">
                                {`${currentImageIndex + 1}/${
                                    yogaClass.imageUrls?.length || 1
                                }`}
                            </AppText>
                        </View>
                    </View>
                </View>

                {/* Intro-Summary */}
                <View className="class-header-container p-[25px] border-b border-tertiary">
                    <View className="class-header gap-[20px]">
                        <View className="key-summary-container gap-[10px]">
                            <View className="text-container gap-[7px]">
                                <AppText
                                    weight="semibold"
                                    className="title text-[22px] "
                                >
                                    {yogaClass.title}
                                </AppText>
                                <View className="meta-info-container gap-[20px]">
                                    <View className="card-meta-container flex-row items-center gap-[5px]">
                                        <View className="card-location-container flex-row items-center gap-[5px]">
                                            <AddressIcon />
                                            <AppText className="text-[13px] text-tertiary">
                                                {locationInfo?.roadAddress ||
                                                    "위치 정보 없음"}
                                            </AppText>
                                        </View>
                                        <View className="card-date-container flex-row items-center gap-[5px]">
                                            <CalendarIcon />
                                            <FormattedTimeSlots
                                                timeSlots={enrichedTimeSlots}
                                                classId={yogaClass.id}
                                                className="text-[13px] text-tertiary"
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View className="card-tags-container flex-row items-center gap-[7px] ">
                                {tags.map((tag) => (
                                    <View
                                        key={tag.id}
                                        className="tag-container flex justify-center items-center p-[7px] gap-[10px] rounded-[7px] bg-primary"
                                    >
                                        <AppText className="text-[13px] text-white">
                                            {tag.name}
                                        </AppText>
                                    </View>
                                ))}
                            </View>
                        </View>
                        <AppText className="description text-[15px] ">
                            {yogaClass.description}
                        </AppText>
                        <TouchableOpacity onPress={openExternalLink}>
                            <AppText className="text-[15px] text-linkBlue">
                                클래스 상세보기
                            </AppText>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Instructor */}
                {/* <View className="instructor-container gap-[20px] p-[25px] border-b border-tertiary">
                    <View className="instructor-info-container gap-[20px]">
                        <AppText
                            weight="semibold"
                            className="title text-[18px] "
                        >
                            지도자 소개
                        </AppText>
                        <View className="instructor-info flex-row gap-[20px]">
                            <View className="instructor-image h-[60px] w-[60px] rounded-full bg-gray-300"></View>
                            <View className="instructor-info-container gap-[10px] flex-1">
                                <AppText
                                    weight="semibold"
                                    className="instructor-name text-[15px]"
                                >
                                    {instructor.name}
                                </AppText>
                                <AppText
                                    className="instructor-description text-[13px] text-secondary"
                                    numberOfLines={2}
                                >
                                    {instructor.bio}
                                </AppText>
                                {instructor.instagram && (
                                    <TouchableOpacity
                                        onPress={() =>
                                            Linking.openURL(
                                                instructor.instagram!
                                            )
                                        }
                                    >
                                        <AppText className="text-[13px] text-linkBlue">
                                            인스타그램 보기
                                        </AppText>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    </View>
                </View> */}

                {/* Booking */}
                <View className="booking-container gap-[20px] px-[25px] pt-[25px] pb-[35px] border-b border-tertiary">
                    <View className="booking gap-[20px]">
                        <AppText
                            weight="semibold"
                            className="title text-[18px] "
                        >
                            예약
                        </AppText>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            className="time-slot-container flex-row "
                        >
                            {enrichedTimeSlots
                                .filter((slot) => slot.classId === yogaClass.id)
                                .map((slot) => (
                                    <TimeSlotCard
                                        key={slot.id}
                                        id={slot.id}
                                        startTime={slot.startTime}
                                        endTime={slot.endTime}
                                        title={yogaClass.title}
                                        price={slot.price}
                                        isFull={slot.isFull}
                                        isSelected={
                                            selectedTimeSlotId === slot.id
                                        }
                                        onPress={() => {
                                            if (slot.isFull) return;
                                            setSelectedTimeSlotId(
                                                selectedTimeSlotId === slot.id
                                                    ? null
                                                    : slot.id
                                            );
                                        }}
                                    />
                                ))}
                        </ScrollView>
                    </View>
                </View>

                {/* Address */}
                <View className="address-container gap-[10px] p-[25px]">
                    <AppText weight="semibold" className="title text-[18px] ">
                        위치
                    </AppText>
                    {/* 지도 넣을 곳 */}
                    {/* <View className="map-container bg-gray-300 h-[100px] rounded-[10px]"></View> */}
                    <AppText className="address text-[13px] px-[5px]">
                        {locationInfo?.roadAddress || "위치 정보 없음"}
                    </AppText>
                </View>

                {/* Booking CTA Container */}
                <View className="booking-cta-container flex-row items-center gap-[15px] px-[30px] py-[20px]">
                    <View className="contact-container gap-[5px] ">
                        <ContactIcon />
                        <AppText className="text-[13px]">문의</AppText>
                    </View>
                    <Pressable
                        onPress={() => {
                            if (selectedTimeSlotId) {
                                router.push({
                                    pathname: "/class/booking",
                                    params: {
                                        classId: yogaClass.id,
                                        timeSlotId: selectedTimeSlotId,
                                    },
                                });
                            }
                        }}
                        disabled={!selectedTimeSlotId}
                        className="flex-1"
                    >
                        <View
                            className={`cta-button items-center justify-center flex-1 rounded-[10px] p-[10px] h-[50px] ${
                                selectedTimeSlotId
                                    ? "bg-primary"
                                    : "bg-disabled"
                            }`}
                        >
                            <AppText
                                weight="semibold"
                                className="text-[16px] text-white"
                            >
                                예약하기
                            </AppText>
                        </View>
                    </Pressable>
                </View>
            </ScrollView>
        )
    );
}
