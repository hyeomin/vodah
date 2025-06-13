import AppText from "@/components/Apptext";
import YogaClassCard from "@/components/YogaClassCard";
import { useReservations } from "@/hooks/useReservations";
import { useSupabase } from "@/hooks/useSupabase";
import { useTimeSlots } from "@/hooks/useTimeSlots";
import { useYogaClasses } from "@/hooks/useYogaClasses";
import { enrichTimeSlots } from "@/utils/transformers";
import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetHandle,
    BottomSheetScrollView,
    BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useCallback, useMemo, useRef, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    ScrollView,
    View,
} from "react-native";
import { Feather } from "@expo/vector-icons";

export default function HomeScreen() {
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [selectedDateInfo, setSelectedDateInfo] = useState<Date | null>(null);
    const [selectedTab, setSelectedTab] = useState<"region" | "tag">("region");
    const [selectedCity, setSelectedCity] = useState<string | null>("");
    const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [tempSelectedCity, setTempSelectedCity] = useState<string | null>(selectedCity);
    const [tempSelectedDistricts, setTempSelectedDistricts] = useState<string[]>(selectedDistricts);
    const [tempSelectedTags, setTempSelectedTags] = useState<string[]>(selectedTags);

    const { data: yogaClasses, loading, error } = useYogaClasses();
    const { data: timeSlots = [], loading: loadingSlots } = useTimeSlots();
    const { data: reservations = [], loading: loadingRes } = useReservations();

    const enrichedTimeSlots = useMemo(
        () => enrichTimeSlots(timeSlots, reservations),
        [timeSlots, reservations]
    );

    const uniqueCities = useMemo(() => {
        if (!yogaClasses) return [];
        const cities = yogaClasses
            .map((yogaClass) => yogaClass.location?.city)
            .filter(Boolean);
        return [...new Set(cities)];
    }, [yogaClasses]);

    const uniqueDistricts = useMemo(() => {
        if (!yogaClasses) return [];
        const districts = yogaClasses
            .filter((yogaClass) =>
                tempSelectedCity ? yogaClass.location?.city === tempSelectedCity : true
            )
            .map((yogaClass) => yogaClass.location?.gu)
            .filter(Boolean);
        return [...new Set(districts)];
    }, [yogaClasses, tempSelectedCity]);

    const uniqueTags = useMemo(() => {
        if (!yogaClasses) return [];
        const allTagIds = yogaClasses
            .flatMap((yogaClass) => yogaClass.tagIds)
            .filter(Boolean);
        return [...new Set(allTagIds)];
    }, [yogaClasses]);

    const { data: tags = [], loading: loadingTags } = useSupabase<{
        id: string;
        name: string;
    }>("yoga_class_tags", {
        select: "*",
        filter:
            uniqueTags.length > 0
                ? [{ column: "id", operator: "in", value: uniqueTags }]
                : [],
    });

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
        const classTimeSlots = enrichedTimeSlots.filter(
            (slot) => slot.classId === classId && !slot.isFull
        );
        if (classTimeSlots.length === 0) return 0;
        return Math.min(...classTimeSlots.map((slot) => slot.price));
    };

    // Filter yoga classes based on selected date
    const filteredYogaClasses = useMemo(() => {
        if (!yogaClasses) return [];

        const now = new Date();

        const classIdToNextSlotTime = new Map<string, number>();
        enrichedTimeSlots.forEach((slot) => {
            if (slot.startTime > now) {
                const prev = classIdToNextSlotTime.get(slot.classId);
                if (!prev || slot.startTime < prev) {
                    classIdToNextSlotTime.set(slot.classId, slot.startTime.getTime());
                }
            }
        });

        // First filter out classes that only have time slots in the past
        const classesWithFutureSlots = yogaClasses
            .filter((yogaClass) => classIdToNextSlotTime.has(yogaClass.id))
            .sort(
                (a, b) =>
                (classIdToNextSlotTime.get(a.id) ?? Infinity) -
                (classIdToNextSlotTime.get(b.id) ?? Infinity)
            );

        const classWithMatchingDate = selectedDay ? classesWithFutureSlots.filter((yogaClass) => {
            const hasMatchingTimeSlot = enrichedTimeSlots.some(
                (slot) =>
                    slot.classId === yogaClass.id &&
                    new Date(slot.startTime).getDate() === selectedDay &&
                    slot.startTime > now
            );
            return hasMatchingTimeSlot;
        }) : classesWithFutureSlots;

        const classWithMatchingCity = selectedCity ? classWithMatchingDate.filter((yogaClass) => {
            return yogaClass.location?.city === selectedCity;
        }) : classWithMatchingDate;

        const classWithMatchingDistrict = selectedDistricts.length === 0 ? classWithMatchingCity : classWithMatchingCity.filter((yogaClass) => {
            return selectedDistricts.includes(yogaClass.location?.gu ?? '');
        });

        const classWithMatchingTag = selectedTags.length === 0 ? classWithMatchingDistrict : classWithMatchingDistrict.filter((yogaClass) => {
            return yogaClass.tagIds.some((tagId) => selectedTags.includes(tagId));
        });

        return classWithMatchingTag;
    }, [selectedDay, yogaClasses, enrichedTimeSlots]);

    const snapPoints = useMemo(() => ["25%", "75%"], []);
    const bottomSheetRef = useRef<BottomSheet>(null);
    const tagContentRef = useRef<View>(null);
    const scrollViewRef = useRef<ScrollView>(null);
    const handleCloseBottomSheet = () => bottomSheetRef.current?.close();
    const handleOpenBottomSheet = () => {
        setTempSelectedCity(selectedCity);
        setTempSelectedDistricts(selectedDistricts);
        setTempSelectedTags(selectedTags);
        bottomSheetRef.current?.snapToIndex(1)
    };
    const handleShowResults = () => {
        setSelectedCity(tempSelectedCity);
        setSelectedDistricts(tempSelectedDistricts);
        setSelectedTags(tempSelectedTags);
        handleCloseBottomSheet();
    };

    const handleTagTabPress = () => {
        setSelectedTab("tag");
        handleOpenBottomSheet();
        // Wait for the next frame to ensure the content is rendered
        setTimeout(() => {
            tagContentRef.current?.measure(
                (x, y, width, height, pageX, pageY) => {
                    scrollViewRef.current?.scrollTo({
                        y: pageY,
                        animated: true,
                    });
                }
            );
        }, 0);
    };

    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop
                {...props}
                appearsOnIndex={0}
                disappearsOnIndex={-1}
            />
        ),
        []
    );

    const handleResetFilters = () => {
        setSelectedCity(null);
        setSelectedDistricts([]);
        setSelectedTags([]);
        setSelectedDateInfo(null);
        setSelectedDay(null);
    };

    const isAnyLoading = loading || loadingSlots || loadingRes || loadingTags;

    return (
        <View className="container bg-background flex-1">
            {/* <Link href="/login">Login</Link> */}
            {/* Date Picker */}
            <View className="date-picker-container">
                <Pressable className="date-picker-header py-[15px] flex-row justify-center items-center gap-[3px] self-stretch">
                    <AppText weight="semibold" className="text-[17px]">
                        {`${displayDate.getFullYear()}년 ${
                            displayDate.getMonth() + 1
                        }월`}
                    </AppText>
                    {/* <DownArrowIcon />  */}
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
                <Pressable onPress={handleOpenBottomSheet}>
                    <View className="filter-option-region items-center px-[15px] py-[7px] gap-[5px] rounded-[15px] border border-border">
                        <AppText>지역</AppText>
                    </View>
                </Pressable>
                <Pressable onPress={handleTagTabPress}>
                    <View className="filter-option-tag items-center px-[15px] py-[7px] gap-[5px] rounded-[15px] border border-border">
                        <AppText>태그</AppText>
                    </View>
                </Pressable>
                <Pressable onPress={handleResetFilters} style={{ marginLeft: 8 }}>
                    <Feather name="rotate-ccw" size={20} color="#888" />
                </Pressable>
            </View>

            {/* Card List */}
            {isAnyLoading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            ) : error ? (
                <View className="flex-1 justify-center items-center">
                    <AppText className="text-red-500">
                        Error loading classes
                    </AppText>
                </View>
            ) : (
                <FlatList
                    data={filteredYogaClasses}
                    renderItem={({ item }) => (
                        <YogaClassCard
                            item={item}
                            enrichedTimeSlots={enrichedTimeSlots}
                            getMinPriceForClass={getMinPriceForClass}
                        />
                    )}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingVertical: 10, gap: 30 }}
                    showsVerticalScrollIndicator={false}
                />
            )}
            <BottomSheet
                ref={bottomSheetRef}
                index={-1}
                snapPoints={snapPoints}
                backgroundStyle={{ backgroundColor: "white" }}
                style={{ flex: 1 }}
                enablePanDownToClose={true}
                backdropComponent={renderBackdrop}
                handleComponent={(props) => (
                    <BottomSheetHandle
                        {...props}
                        style={{
                            height: 30,
                            borderTopLeftRadius: 10,
                            borderTopRightRadius: 10,
                        }}
                    />
                )}
                enableContentPanningGesture={false}
                enableHandlePanningGesture={true}
            >
                <BottomSheetView className="flex-1">
                    <BottomSheetView className="filter-tab-container border-b border-border flex-row px-[20px] gap-[10px] absolute top-0 left-0 right-0 bg-white z-10">
                        <Pressable onPress={() => setSelectedTab("region")}>
                            <AppText
                                weight="semibold"
                                className={`filter-name-region self-start text-[15px] p-[10px] ${
                                    selectedTab === "region"
                                        ? "border-b-2 border-black"
                                        : "text-primary"
                                }`}
                            >
                                지역
                            </AppText>
                        </Pressable>
                        <Pressable onPress={handleTagTabPress}>
                            <AppText
                                className={`filter-name-tag self-start text-[15px] p-[10px] ${
                                    selectedTab === "tag"
                                        ? "border-b-2 border-black"
                                        : "text-primary"
                                }`}
                            >
                                태그
                            </AppText>
                        </Pressable>
                    </BottomSheetView>
                    <BottomSheetScrollView
                        ref={scrollViewRef}
                        className="filter-content-container flex-1 mt-[60px]"
                        showsVerticalScrollIndicator={true}
                    >
                        <BottomSheetView className="region-filter-content p-[25px] gap-[15px]">
                            <AppText
                                weight="semibold"
                                className="filter-title text-[17px] px-[5px]"
                            >
                                지역
                            </AppText>
                            {/* 요가 클래스 데이터에 한 번이라도 포함된 city unique하게 fetch */}
                            <BottomSheetView className="filter-content-list flex-row flex-wrap justify-between">
                                {uniqueCities.map((city) => (
                                    <Pressable
                                        key={city}
                                        className="w-[20%] items-center py-[10px]"
                                        onPress={() => {
                                                city &&
                                                setTempSelectedCity(
                                                    tempSelectedCity === city
                                                        ? null
                                                        : city
                                                )
                                                setTempSelectedDistricts([]);
                                            }
                                        }
                                    >
                                        <AppText
                                            weight={
                                                tempSelectedCity === city
                                                    ? "bold"
                                                    : "semibold"
                                            }
                                            className={`text-[14px] text-center ${
                                                tempSelectedCity === city
                                                    ? "text-primary"
                                                    : ""
                                            }`}
                                        >
                                            {city}
                                        </AppText>
                                    </Pressable>
                                ))}
                            </BottomSheetView>
                            {/* 선택된 city에 대한 district unique하게 fetch; 한 번이라도 동일한 요가 클래스에서 같이 등장한 city와 district */}
                            {tempSelectedCity && (
                                <BottomSheetView className="filter-content-list-minor flex-row flex-wrap bg-border rounded-[10px] p-[15px] gap-[10px]">
                                    {uniqueDistricts.map(
                                        (district) =>
                                            district && (
                                                <Pressable
                                                    key={district}
                                                    className={`p-[7px] rounded-[7px] ${
                                                        tempSelectedDistricts.includes(
                                                            district
                                                        )
                                                            ? "bg-primary"
                                                            : "bg-white"
                                                    }`}
                                                    onPress={() => {
                                                        setTempSelectedDistricts(
                                                            (prev) =>
                                                                prev.includes(
                                                                    district
                                                                )
                                                                    ? prev.filter(
                                                                          (d) =>
                                                                              d !==
                                                                              district
                                                                      )
                                                                    : [
                                                                          ...prev,
                                                                          district,
                                                                      ]
                                                        );
                                                    }}
                                                >
                                                    <AppText
                                                        className={`text-[14px] text-center ${
                                                            tempSelectedDistricts.includes(
                                                                district
                                                            )
                                                                ? "text-white"
                                                                : ""
                                                        }`}
                                                    >
                                                        {district}
                                                    </AppText>
                                                </Pressable>
                                            )
                                    )}
                                </BottomSheetView>
                            )}
                        </BottomSheetView>
                        <View
                            className="tag-filter-content p-[25px] gap-[15px] mt-[20px]"
                            ref={tagContentRef}
                        >
                            <AppText
                                weight="semibold"
                                className="filter-title text-[17px] px-[5px]"
                            >
                                태그
                            </AppText>
                            <BottomSheetView className="filter-content-list flex-row flex-wrap bg-border rounded-[10px] p-[15px] gap-[10px]">
                                {tags.map((tag) => (
                                    <Pressable
                                        key={tag.id}
                                        className={`p-[7px] rounded-[7px] ${
                                            tempSelectedTags.includes(tag.id)
                                                ? "bg-primary"
                                                : "bg-white"
                                        }`}
                                        onPress={() => {
                                            setTempSelectedTags((prev) =>
                                                prev.includes(tag.id)
                                                    ? prev.filter(
                                                          (id) => id !== tag.id
                                                      )
                                                    : [...prev, tag.id]
                                            );
                                        }}
                                    >
                                        <AppText
                                            className={`text-[14px] text-center ${
                                                tempSelectedTags.includes(tag.id)
                                                    ? "text-white"
                                                    : ""
                                            }`}
                                        >
                                            {tag.name}
                                        </AppText>
                                    </Pressable>
                                ))}
                            </BottomSheetView>
                        </View>
                    </BottomSheetScrollView>
                    <View className="bg-white absolute bottom-0 left-0 right-0 p-[20px] flex-row gap-[10px]">
                        <Pressable
                            className="bg-white py-[15px] px-[40px] border border-border rounded-[7px] items-center"
                            onPress={handleCloseBottomSheet}
                        >
                            <AppText className="text-[14px]" weight="semibold">
                                닫기
                            </AppText>
                        </Pressable>
                        <Pressable
                            className={`flex-1 py-[15px] rounded-[7px] items-center ${
                                tempSelectedDistricts.length > 0 ||
                                tempSelectedTags.length > 0
                                    ? "bg-primary"
                                    : "bg-disabled"
                            }`}
                            onPress={handleShowResults}
                            disabled={
                                tempSelectedDistricts.length === 0 &&
                                tempSelectedTags.length === 0
                            }
                        >
                            <AppText
                                className="text-white text-[14px]"
                                weight="semibold"
                            >
                                결과보기
                            </AppText>
                        </Pressable>
                    </View>
                </BottomSheetView>
            </BottomSheet>
        </View>
    );
}
