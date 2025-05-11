import AppText from "@/components/Apptext";
import FormattedTimeSlots from "@/components/FormattedTimeSlots";
import {
    AddressIcon,
    CalendarIcon,
    ContactIcon,
    DownArrowIcon,
} from "@/components/SvgIcons";
import {
    dummyInstructors,
    dummyTags,
    dummyYogaClasses,
    enrichedDummyTimeSlots,
} from "@/dummyData";
import {
    DIFFICULTY_DISPLAY_NAMES,
    Instructor,
    LOCATION_DISPLAY_NAMES,
} from "@/types/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
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
    const { classId } = useLocalSearchParams();
    const router = useRouter();
    const [selectedTimeSlotId, setSelectedTimeSlotId] = useState<string | null>(
        null
    );
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const screenWidth = Dimensions.get("window").width;

    const yogaClass = classId
        ? dummyYogaClasses.find((yogaClass) => yogaClass.id === classId)
        : dummyYogaClasses[0];

    if (!yogaClass) {
        return (
            <View className="flex-1 bg-background items-center justify-center">
                <AppText>수업을 찾을 수 없습니다.</AppText>
            </View>
        );
    }

    const instructor = dummyInstructors.find(
        (inst: Instructor) => inst.id === yogaClass.instructorId
    ) || { name: "Unknown Instructor", bio: "No bio available" };

    const tags = yogaClass.tagIds.map((tagId) => {
        const tag = dummyTags.find((t) => t.id === tagId);
        return {
            id: tagId,
            name: tag?.name || tagId,
        };
    });

    const handleScroll = (event: any) => {
        const contentOffset = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffset / screenWidth);
        setCurrentImageIndex(index);
    };

    const openExternalLink = async () => {
        const url = "https://www.instagram.com/maitri._.hannam/";
        const supported = await Linking.canOpenURL(url);

        if (supported) {
            await Linking.openURL(url);
        } else {
            Alert.alert("알림", "링크를 열 수 없습니다.");
        }
    };

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
                        {yogaClass.image_urls?.map((url, index) => (
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
                        <View className="key-tag-container bg-white rounded-[5px] p-[5px]">
                            <AppText className="text-[13px]">
                                {`${
                                    LOCATION_DISPLAY_NAMES[yogaClass.isIndoor]
                                } · ${
                                    DIFFICULTY_DISPLAY_NAMES[
                                        yogaClass.difficulty
                                    ]
                                }`}
                            </AppText>
                        </View>
                        <View className="class-title-container w-[70px] p-[5px] justify-center items-center gap-[10px] rounded-l-[10px] bg-black/30">
                            <AppText className="page-number text-[13px] text-white">
                                {`${currentImageIndex + 1}/${
                                    yogaClass.image_urls?.length || 1
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
                                                {`${yogaClass.location?.city} ${yogaClass.location?.gu} ${yogaClass.location?.dong}`}
                                            </AppText>
                                        </View>
                                        <View className="card-date-container flex-row items-center gap-[5px]">
                                            <CalendarIcon />
                                            <FormattedTimeSlots
                                                timeSlots={
                                                    enrichedDummyTimeSlots
                                                }
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
                <View className="instructor-container gap-[20px] p-[25px] border-b border-tertiary">
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
                            </View>
                        </View>
                    </View>
                </View>

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
                            {enrichedDummyTimeSlots
                                .filter((slot) => slot.classId === yogaClass.id)
                                .map((slot) => {
                                    const date =
                                        slot.startTime.toLocaleDateString(
                                            "ko-KR",
                                            {
                                                month: "numeric",
                                                day: "numeric",
                                                weekday: "short",
                                            }
                                        );
                                    const time =
                                        slot.startTime.toLocaleTimeString(
                                            "ko-KR",
                                            {
                                                hour: "numeric",
                                                minute: "numeric",
                                                hour12: true,
                                            }
                                        );

                                    const isSelected =
                                        selectedTimeSlotId === slot.id;

                                    if (slot.isFull) {
                                        return (
                                            <View
                                                key={slot.id}
                                                className="one-slot-full bg-border w-[120px] p-[10px] gap-[5px] justify-center items-center rounded-[10px] mr-[15px]"
                                            >
                                                <AppText className="text-[13px] text-tertiary">
                                                    {date}
                                                </AppText>
                                                <AppText className="time-slot-time text-[13px] text-tertiary">
                                                    {time}
                                                </AppText>
                                                <AppText className="class-title text-[10px] text-tertiary text-center">
                                                    {yogaClass.title}
                                                </AppText>
                                            </View>
                                        );
                                    }

                                    if (isSelected) {
                                        return (
                                            <Pressable
                                                key={slot.id}
                                                onPress={() =>
                                                    setSelectedTimeSlotId(null)
                                                }
                                                className="one-slot-selected bg-primary w-[120px] p-[10px] gap-[5px] justify-center items-center rounded-[10px] mr-[15px]"
                                            >
                                                <AppText
                                                    weight="semibold"
                                                    className="text-[13px] text-white"
                                                >
                                                    {date}
                                                </AppText>
                                                <AppText
                                                    weight="semibold"
                                                    className="text-[13px] text-white"
                                                >
                                                    {time}
                                                </AppText>
                                                <AppText
                                                    weight="semibold"
                                                    className="text-[10px] text-white text-center"
                                                >
                                                    {yogaClass.title}
                                                </AppText>
                                            </Pressable>
                                        );
                                    }

                                    return (
                                        <Pressable
                                            key={slot.id}
                                            onPress={() =>
                                                setSelectedTimeSlotId(slot.id)
                                            }
                                            className="one-slot-default bg-background border border-primary w-[120px] p-[10px] gap-[5px] justify-center items-center rounded-[10px] mr-[15px]"
                                        >
                                            <AppText className="text-[13px]">
                                                {date}
                                            </AppText>
                                            <AppText className="text-[13px]">
                                                {time}
                                            </AppText>
                                            <AppText className="text-[10px] text-center">
                                                {yogaClass.title}
                                            </AppText>
                                        </Pressable>
                                    );
                                })}
                        </ScrollView>
                    </View>
                </View>

                {/* Address */}
                <View className="address-container gap-[10px] p-[25px]">
                    <AppText weight="semibold" className="title text-[18px] ">
                        위치
                    </AppText>
                    <View className="map-container bg-gray-300 h-[100px] rounded-[10px]"></View>
                    <AppText className="address text-[13px] px-[5px]">
                        성남시 분당구 성남대로 393 두산위브 파빌리온 주소가
                        길어지면 다음 줄로 넘어갑니다.
                    </AppText>
                </View>

                {/* Booking CTA Container */}
                <View className="booking-cta-container flex-row items-center bg-white gap-[15px] px-[30px] py-[20px]">
                    <View className="contact-container gap-[5px] ">
                        <ContactIcon />
                        <AppText className="text-[13px]">문의</AppText>
                    </View>
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
        )
    );
}
