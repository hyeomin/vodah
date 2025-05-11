import AppText from "@/components/Apptext";
import FormattedTimeSlots from "@/components/FormattedTimeSlots";
import {
    AddressIcon,
    CalendarIcon,
    DownArrowIcon,
    FilterIcon,
} from "@/components/SvgIcons";
import { dummyYogaClasses, enrichedDummyTimeSlots } from "@/dummyData";
import { YogaClass } from "@/types/types";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, Image, Pressable, View } from "react-native";

export default function HomeScreen() {
    const router = useRouter();
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [selectedDateInfo, setSelectedDateInfo] = useState<Date | null>(null);

    // Generate dates array
    const days = useMemo(() => {
        const today = new Date();
        const dayLabels = ["일", "월", "화", "수", "목", "금", "토"];
        const dates = [];

        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            dates.push({
                label: dayLabels[date.getDay()],
                date: date.getDate(),
                fullDate: date,
                selected: selectedDay === date.getDate(),
                isToday: i === 0,
                weekend: date.getDay() === 0 || date.getDay() === 6,
            });
        }

        return dates;
    }, [selectedDay]);

    // Get the display date (today if no day selected, otherwise the selected day's date)
    const displayDate = useMemo(() => {
        if (selectedDateInfo) return selectedDateInfo;
        return new Date();
    }, [selectedDateInfo]);

    // Helper function to find minimum price for a class
    const getMinPriceForClass = (classId: string): number => {
        const classTimeSlots = enrichedDummyTimeSlots.filter(
            (slot) => slot.classId === classId && !slot.isFull
        );
        if (classTimeSlots.length === 0) return 0;
        return Math.min(...classTimeSlots.map((slot) => slot.price));
    };

    // Filter yoga classes based on selected date
    const filteredYogaClasses = useMemo(() => {
        if (selectedDay === null) return dummyYogaClasses;

        return dummyYogaClasses.filter((yogaClass) => {
            const hasMatchingTimeSlot = enrichedDummyTimeSlots.some(
                (slot) =>
                    slot.classId === yogaClass.id &&
                    new Date(slot.startTime).getDate() === selectedDay
            );
            return hasMatchingTimeSlot;
        });
    }, [selectedDay]);

    const filters = ["지역", "카테고리", "난이도", "태그"];

    const YogaClassCard = ({ item }: { item: YogaClass }) => (
        <Pressable
            onPress={() =>
                router.push({
                    pathname: "/[classId]",
                    params: { classId: item.id },
                })
            }
            className="single-card w-full gap-[10px] px-[20px]"
        >
            <View
                key="image"
                className="card-image h-[150px] rounded-[10px] overflow-hidden"
            >
                <Image
                    source={{ uri: item.image_urls[0] }}
                    className="w-full h-full"
                    resizeMode="cover"
                />
            </View>
            <View key="content" className="card-content gap-[7px]">
                <AppText weight="semibold" className="text-[17px]">
                    {item.title}
                </AppText>
                <View
                    key="meta"
                    className="card-meta-container flex-row items-center gap-[10px]"
                >
                    <View
                        key="location"
                        className="card-location-container flex-row items-center gap-[5px]"
                    >
                        <AddressIcon />
                        <AppText className="text-[13px] text-tertiary">
                            {item.location
                                ? `${item.location.city} ${item.location.gu} ${item.location.dong}`
                                : "위치 정보 없음"}
                        </AppText>
                    </View>
                    <View
                        key="date"
                        className="card-date-container flex-row items-center gap-[5px]"
                    >
                        <CalendarIcon />
                        <AppText className="text-[13px] text-tertiary">
                            <FormattedTimeSlots
                                timeSlots={enrichedDummyTimeSlots}
                                classId={item.id}
                                className="text-[13px] text-tertiary"
                            />
                        </AppText>
                    </View>
                </View>
                <View
                    key="price"
                    className="card-price-container flex-row items-center gap-[5px]"
                >
                    <AppText className="text-[16px] tracking-[0.014px]">
                        {`${getMinPriceForClass(item.id).toLocaleString()}원~`}
                    </AppText>
                    <AppText className="text-[13px] text-tertiary">
                        / 1회
                    </AppText>
                </View>
            </View>
        </Pressable>
    );

    return (
        <View className="container bg-background flex-1">
            {/* Date Picker */}
            <View className="date-picker-container">
                <Pressable className="date-picker-header py-[15px] flex-row justify-center items-center gap-[3px] self-stretch">
                    <AppText weight="semibold" className="text-[17px]">
                        {`${displayDate.getFullYear()}년 ${
                            displayDate.getMonth() + 1
                        }월`}
                    </AppText>
                    <DownArrowIcon />
                </Pressable>
                <FlatList
                    data={days}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingHorizontal: 10,
                        paddingVertical: 10,
                    }}
                    renderItem={({ item: day }) => (
                        <Pressable
                            onPress={() => {
                                if (selectedDay === day.date) {
                                    setSelectedDay(null);
                                    setSelectedDateInfo(null);
                                } else {
                                    setSelectedDay(day.date);
                                    setSelectedDateInfo(day.fullDate);
                                }
                            }}
                            className="one-day-container items-center gap-[6px] mx-[10px]"
                        >
                            <AppText>{day.label}</AppText>
                            <View
                                className={`date-container w-[40px] h-[40px] flex-col justify-center items-center rounded-full ${
                                    day.selected ? "bg-primary" : ""
                                }`}
                            >
                                <AppText
                                    weight={
                                        day.selected ? "semibold" : "regular"
                                    }
                                    className={`text-[16px] tracking-[0.016px] ${
                                        day.selected ? "text-white" : ""
                                    }`}
                                >
                                    {day.date}
                                </AppText>
                            </View>
                            {day.isToday && (
                                <View className="dot h-[6px] w-[6px] bg-accent rounded-full"></View>
                            )}
                        </Pressable>
                    )}
                    keyExtractor={(day) => `${day.label}-${day.date}`}
                />
            </View>

            {/* Filter Bar */}
            <View className="filter-container flex-row px-[20px] py-[10px] gap-[5px] items-center">
                <View className="filter-summary flex-row items-center px-[15px] py-[7px] gap-[5px] rounded-[15px] border border-border">
                    <FilterIcon />
                    <AppText className="text-[13px]">필터</AppText>
                </View>
                {filters.map((filter) => (
                    <View
                        key={filter}
                        className="filter-option items-center px-[15px] py-[7px] gap-[5px] rounded-[15px] border border-border"
                    >
                        <AppText>{filter}</AppText>
                    </View>
                ))}
            </View>

            {/* Card List */}
            <FlatList
                data={filteredYogaClasses}
                renderItem={YogaClassCard}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingVertical: 10, gap: 30 }}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}
