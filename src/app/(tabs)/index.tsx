import AppText from "@/components/Apptext";
import Footer from "@/components/Footer";
import SvgIcons from "@/components/icons/SvgIcons";
import YogaClassCard from "@/components/YogaClassCard";
import { useReservations } from "@/hooks/useReservations";
import { useSupabase } from "@/hooks/useSupabase";
import { useTimeSlots } from "@/hooks/useTimeSlots";
import { useYogaClasses } from "@/hooks/useYogaClasses";
import { enrichTimeSlots } from "@/utils/transformers";
import { useRouter } from "expo-router";
import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetHandle,
    BottomSheetScrollView,
    BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, View, Text } from "react-native";
import Modal from 'react-native-modal';

export default function HomeScreen() {
    const [selectedDates, setSelectedDates] = useState<Date[]>([]);
    const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
    const [selectedTab, setSelectedTab] = useState<"region" | "tag">("region");
    const [selectedCity, setSelectedCity] = useState<string | null>("");
    const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [tempSelectedCity, setTempSelectedCity] = useState<string | null>(
        selectedCity
    );
    const [tempSelectedDistricts, setTempSelectedDistricts] =
        useState<string[]>(selectedDistricts);
    const [tempSelectedTags, setTempSelectedTags] =
        useState<string[]>(selectedTags);
    const [calendarVisible, setCalendarVisible] = useState(false);
    const [tempSelectedDates, setTempSelectedDates] = useState<Date[]>([]);
    const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
    const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());

    const { data: yogaClasses, loading, error } = useYogaClasses();
    const { data: timeSlots = [], loading: loadingSlots } = useTimeSlots();
    const { data: reservations = [], loading: loadingRes } = useReservations();

    const router = useRouter();
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
                tempSelectedCity
                    ? yogaClass.location?.city === tempSelectedCity
                    : true
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
                selected: selectedDates.some(
                    d => d.getFullYear() === date.getFullYear() &&
                         d.getMonth() === date.getMonth() &&
                         d.getDate() === date.getDate()
                ),
                isToday: i === 0,
                weekend: date.getDay() === 0 || date.getDay() === 6,
            });
        }

        return dates;
    }, [selectedDates]);

    const snapPoints = useMemo(() => ["25%", "75%"], []);
    const bottomSheetRef = useRef<BottomSheet>(null);
    const regionContentRef = useRef<View>(null);
    const tagContentRef = useRef<View>(null);
    const scrollViewRef = useRef<any>(null);
    const handleCloseBottomSheet = () => bottomSheetRef.current?.close();
    const handleOpenBottomSheet = () => {
        setTempSelectedCity(selectedCity);
        setTempSelectedDistricts(selectedDistricts);
        setTempSelectedTags(selectedTags);
        bottomSheetRef.current?.expand();
    };
    const handleShowResults = () => {
        setSelectedCity(tempSelectedCity);
        setSelectedDistricts(tempSelectedDistricts);
        setSelectedTags(tempSelectedTags);
        handleCloseBottomSheet();
    };

    const handleRegionTabPress = () => {
        setSelectedTab("region");
        handleOpenBottomSheet();
        setTimeout(() => {
            if (regionContentRef.current && scrollViewRef.current) {
                regionContentRef.current.measureLayout(
                    scrollViewRef.current.getNativeScrollRef(),
                    (x, y) => {
                        scrollViewRef.current?.scrollTo({ y, animated: true });
                    }
                );
            }
        }, 100);
    };

    const handleTagTabPress = () => {
        setSelectedTab("tag");
        handleOpenBottomSheet();
        setTimeout(() => {
            if (tagContentRef.current && scrollViewRef.current) {
                tagContentRef.current.measureLayout(
                    scrollViewRef.current.getNativeScrollRef(),
                    (x, y) => {
                        scrollViewRef.current?.scrollTo({ y, animated: true });
                    }
                );
            }
        }, 100);
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
        setSelectedDates([]);
    };

    const isAnyLoading = loading || loadingSlots || loadingRes || loadingTags;

    const onViewableItemsChanged = useRef(({
        viewableItems
    }: { viewableItems: Array<{ item: { fullDate: Date } }> }) => {
        if (viewableItems.length > 0) {
            const firstDate = viewableItems[0].item.fullDate;
            setCurrentMonth(firstDate.getMonth());
            setCurrentYear(firstDate.getFullYear());
        }
    }).current;

    const filteredYogaClasses = useMemo(() => {
        if (!yogaClasses) return [];

        const now = new Date();

        const classIdToNextSlotTime = new Map<string, number>();
        enrichedTimeSlots.forEach((slot) => {
            if (slot.startTime > now) {
                const prev = classIdToNextSlotTime.get(slot.classId);
                if (!prev || slot.startTime.getTime() < prev) {
                    classIdToNextSlotTime.set(
                        slot.classId,
                        slot.startTime.getTime()
                    );
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

        const classWithMatchingDate = selectedDates.length > 0
            ? classesWithFutureSlots.filter((yogaClass) => {
                const hasMatchingTimeSlot = enrichedTimeSlots.some(
                    (slot) =>
                        slot.classId === yogaClass.id &&
                        selectedDates.some(
                            d =>
                                d.getFullYear() === slot.startTime.getFullYear() &&
                                d.getMonth() === slot.startTime.getMonth() &&
                                d.getDate() === slot.startTime.getDate()
                        ) &&
                        slot.startTime > now
                );
                return hasMatchingTimeSlot;
            })
            : classesWithFutureSlots;

        const classWithMatchingCity = selectedCity
            ? classWithMatchingDate.filter((yogaClass) => {
                  return yogaClass.location?.city === selectedCity;
              })
            : classWithMatchingDate;

        const classWithMatchingDistrict =
            selectedDistricts.length === 0
                ? classWithMatchingCity
                : classWithMatchingCity.filter((yogaClass) => {
                      return selectedDistricts.includes(
                          yogaClass.location?.gu ?? ""
                      );
                  });

        const classWithMatchingTag =
            selectedTags.length === 0
                ? classWithMatchingDistrict
                : classWithMatchingDistrict.filter((yogaClass) => {
                      return yogaClass.tagIds.some((tagId) =>
                          selectedTags.includes(tagId)
                      );
                  });

        return classWithMatchingTag;
    }, [selectedDates, yogaClasses, enrichedTimeSlots, selectedCity, selectedDistricts, selectedTags]);

    // Helper function to find minimum price for a class
    const getMinPriceForClass = (classId: string): number => {
        const classTimeSlots = enrichedTimeSlots.filter(
            (slot) => slot.classId === classId && !slot.isFull
        );
        if (classTimeSlots.length === 0) return 0;
        return Math.min(...classTimeSlots.map((slot) => slot.price));
    };

    const openCalendar = () => {
        setTempSelectedDates(selectedDates);
        setCalendarVisible(true);
    };
    const closeCalendar = () => setCalendarVisible(false);
    const applyCalendar = () => {
        setSelectedDates(tempSelectedDates);
        setCalendarVisible(false);
    };

    const calendarRows = useMemo(() => {
        const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
        const firstDay = new Date(calendarYear, calendarMonth, 1).getDay();
        const rows = [];
        let row = [];

        for (let i = 0; i < firstDay; i++) {
            row.push(null);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            row.push(new Date(calendarYear, calendarMonth, day));
            if ((firstDay + day) % 7 === 0) {
                rows.push(row);
                row = [];
            }
        }

        while (row.length < 7) {
            row.push(null);
        }
        rows.push(row);

        return rows;
    }, [calendarYear, calendarMonth]);

    // 요일 헤더 부분 수정
    <View className="flex-row justify-center items-center gap-x-1 mb-3">
        {["일", "월", "화", "수", "목", "금", "토"].map((d, i) => (
            <Text key={d} className="font-bold text-[14px] leading-[17px] text-gray-400 w-[36px] text-center">
                {d}
            </Text>
        ))}
    </View>

    // 달력 날짜 그리드에서 실제로 수업이 있는 날짜만 enable
    const availableDatesSet = useMemo(() => {
        return new Set(
            enrichedTimeSlots
                .filter(slot =>
                    slot.startTime.getFullYear() === calendarYear &&
                    slot.startTime.getMonth() === calendarMonth
                )
                .map(slot => slot.startTime.getDate())
        );
    }, [enrichedTimeSlots, calendarYear, calendarMonth]);

    return (
        <View className="container bg-background flex-1">
            {/* Date Picker */}
            <View className="relative w-full">
                <View className="flex-row justify-center items-center py-[15px] gap-[3px] w-full">
                    <Pressable
                        className="flex-row justify-center items-center gap-[3px]"
                        onPress={openCalendar}
                    >
                        <AppText weight="semibold" className="text-[17px]">
                            {`${currentYear}년 ${currentMonth + 1}월`}
                        </AppText>
                        <SvgIcons.DownArrowIcon />
                    </Pressable>
                </View>
            </View>
            <Pressable
                className="absolute right-[10px] top-[10px] w-[56px] h-[29px] bg-[#8889BD] rounded-[7px] flex-row justify-center items-center z-10"
                onPress={() => { router.push('/login'); }}
            >
                <Text className="text-white text-[13px] font-medium" style={{ fontFamily: 'Roboto' }}>로그인</Text>
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
                            const alreadySelected = selectedDates.some(
                                d => d.getFullYear() === day.fullDate.getFullYear() &&
                                     d.getMonth() === day.fullDate.getMonth() &&
                                     d.getDate() === day.fullDate.getDate()
                            );
                            if (alreadySelected) {
                                setSelectedDates(selectedDates.filter(
                                    d => !(d.getFullYear() === day.fullDate.getFullYear() &&
                                           d.getMonth() === day.fullDate.getMonth() &&
                                           d.getDate() === day.fullDate.getDate())
                                ));
                            } else {
                                setSelectedDates([...selectedDates, day.fullDate]);
                            }
                        }}
                        className="one-day-container items-center gap-[6px] mx-[10px]"
                    >
                        <AppText
                            className={
                                day.weekend ? "text-red-500" : undefined
                            }
                        >
                            {day.label}
                        </AppText>
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
                                }${day.weekend ? " text-red-500" : ""}`}
                            >
                                {day.date}
                            </AppText>
                        </View>
                        {day.isToday && (
                            <View className="dot h-[6px] w-[6px] bg-accent rounded-full"></View>
                        )}
                    </Pressable>
                )}
                keyExtractor={(day) => `${day.label}-${day.fullDate.toISOString()}`}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
            />

            {/* Filter Bar */}
            <View className="filter-container flex-row px-[20px] py-[10px] gap-[5px] items-center">
                <Pressable onPress={handleRegionTabPress}>
                    <View className="filter-option-region items-center px-[15px] py-[7px] gap-[5px] rounded-[15px] border border-border">
                        <AppText>지역</AppText>
                    </View>
                </Pressable>
                <Pressable onPress={handleTagTabPress}>
                    <View className="filter-option-tag items-center px-[15px] py-[7px] gap-[5px] rounded-[15px] border border-border">
                        <AppText>태그</AppText>
                    </View>
                </Pressable>
                <Pressable onPress={handleResetFilters}>
                    <View className="reset-filter flex-row items-center px-[15px] py-[7px] gap-[5px] rounded-[15px] border border-border">
                        <SvgIcons.ResetIcon />
                        <AppText>초기화</AppText>
                    </View>
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
            ) : filteredYogaClasses.length === 0 ? (
                <>
                    <View className="flex-1 justify-center items-center pb-[260px]">
                        <AppText className="text-center leading-[20px]">
                            {
                                "죄송합니다. 해당하는 결과가 없습니다.\n얼른 더 많은 수업을 준비할게요!\n\n그전까지 다른 날짜 혹은 다른 수업을 알아봐주세요."
                            }
                        </AppText>
                    </View>
                    <View className="absolute left-0 right-0 bottom-0">
                        <Footer />
                    </View>
                </>
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
                    contentContainerStyle={{ gap: 30 }}
                    showsVerticalScrollIndicator={false}
                    ListFooterComponent={<Footer />}
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
                <BottomSheetView className="filter-tab-container border-b border-border flex-row px-[20px] gap-[10px] absolute top-0 left-0 right-0 bg-white z-10">
                    <Pressable onPress={handleRegionTabPress}>
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
                    className="filter-content-container mt-[60px]"
                    showsVerticalScrollIndicator={true}
                    contentContainerStyle={{ paddingBottom: 40 }}
                >
                    <View ref={regionContentRef}>
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
                                                );
                                            setTempSelectedDistricts([]);
                                        }}
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
                    </View>
                    <View
                        className="tag-filter-content-wrapper"
                        ref={tagContentRef}
                    >
                        <BottomSheetView className="tag-filter-content p-[25px] gap-[15px] mt-[20px]">
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
                                                tempSelectedTags.includes(
                                                    tag.id
                                                )
                                                    ? "text-white"
                                                    : ""
                                            }`}
                                        >
                                            {tag.name}
                                        </AppText>
                                    </Pressable>
                                ))}
                            </BottomSheetView>
                        </BottomSheetView>
                    </View>
                </BottomSheetScrollView>
                <View className="bg-white p-[20px] flex-row gap-[10px]">
                    <Pressable
                        className="bg-white py-[15px] px-[40px] border border-border rounded-[7px] items-center"
                        onPress={handleCloseBottomSheet}
                    >
                        <AppText className="text-[14px]" weight="semibold">
                            닫기
                        </AppText>
                    </Pressable>
                    <Pressable
                        className="flex-1 py-[15px] rounded-[7px] items-center bg-primary"
                        onPress={handleShowResults}
                    >
                        <AppText
                            className="text-white text-[14px]"
                            weight="semibold"
                        >
                            결과보기
                        </AppText>
                    </Pressable>
                </View>
            </BottomSheet>
            <Modal
                isVisible={calendarVisible}
                onBackdropPress={closeCalendar}
                style={{ justifyContent: 'flex-end', margin: 0 }}
                backdropOpacity={0.3}
                animationIn="slideInUp"
                animationOut="slideOutDown"
            >
                <View className="bg-[#F9F8F5] rounded-t-[10px] pt-10 pb-10 px-0 items-center">
                    {/* 상단 핸들 */}
                    <View className="w-[30px] h-[4px] bg-gray-400 rounded-full self-center mb-6" />

                    {/* 월/연도 & 화살표 */}
                    <View className="flex-row items-center justify-center gap-x-[30px] mb-7">
                        <Pressable onPress={() => {
                            // 이전 달로 이동
                            const prevMonth = new Date(calendarYear, calendarMonth - 1, 1);
                            setCalendarYear(prevMonth.getFullYear());
                            setCalendarMonth(prevMonth.getMonth());
                        }}>
                            <View style={{ transform: [{ rotate: '90deg' }] }}>
                                <SvgIcons.DownArrowIcon />
                            </View>
                        </Pressable>
                        <Text className="font-bold text-[16px] leading-[19px] text-black mx-[15px]">
                            {`${calendarYear}년 ${calendarMonth + 1}월`}
                        </Text>
                        <Pressable onPress={() => {
                            // 다음 달로 이동
                            const nextMonth = new Date(calendarYear, calendarMonth + 1, 1);
                            setCalendarYear(nextMonth.getFullYear());
                            setCalendarMonth(nextMonth.getMonth());
                        }}>
                            <View style={{ transform: [{ rotate: '-90deg' }] }}>
                                <SvgIcons.DownArrowIcon />
                            </View>
                        </Pressable>
                    </View>

                    {/* 요일 헤더 */}
                    <View className="flex-row justify-center items-center gap-x-[6px] mb-5">
                        {["일", "월", "화", "수", "목", "금", "토"].map((d, i) => (
                            <Text key={d} className="font-bold text-[14px] leading-[17px] text-gray-400 w-[40px] text-center">
                                {d}
                            </Text>
                        ))}
                    </View>

                    {/* 날짜 그리드 */}
                    <View className="flex-col items-center gap-y-[5px]">
                        {calendarRows.map((week, rowIdx) => (
                            <View key={rowIdx} className="flex-row justify-center items-start gap-x-[6px]">
                                {week.map((day, colIdx) => {
                                    if (!day) {
                                        return <View key={colIdx} className="w-[40px] h-[52px]" />;
                                    }
                                    const isAvailable = (() => {
                                        const today = new Date();
                                        today.setHours(0,0,0,0);
                                        const thisDay = new Date(day);
                                        thisDay.setHours(0,0,0,0);
                                        return availableDatesSet.has(day.getDate()) && thisDay >= today;
                                    })();
                                    const isSelected = tempSelectedDates.some(d =>
                                        d.getFullYear() === day.getFullYear() &&
                                        d.getMonth() === day.getMonth() &&
                                        d.getDate() === day.getDate()
                                    );
                                    const isToday = (() => {
                                        const now = new Date();
                                        return now.getFullYear() === day.getFullYear() &&
                                            now.getMonth() === day.getMonth() &&
                                            now.getDate() === day.getDate();
                                    })();
                                    const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                                    return (
                                        <Pressable
                                            key={colIdx}
                                            className="flex-col items-center gap-[6px] w-[40px] h-[52px]"
                                            onPress={() => {
                                                if (!isAvailable) return;
                                                const alreadySelected = tempSelectedDates.some(
                                                    d => d.getFullYear() === day.getFullYear() &&
                                                        d.getMonth() === day.getMonth() &&
                                                        d.getDate() === day.getDate()
                                                );
                                                if (alreadySelected) {
                                                    setTempSelectedDates(tempSelectedDates.filter(
                                                        d => !(d.getFullYear() === day.getFullYear() &&
                                                            d.getMonth() === day.getMonth() &&
                                                            d.getDate() === day.getDate())
                                                    ));
                                                } else {
                                                    setTempSelectedDates([...tempSelectedDates, day]);
                                                }
                                            }}
                                            disabled={!isAvailable}
                                        >
                                            <View className={`w-[40px] h-[40px] rounded-full flex items-center justify-center ${isSelected ? 'bg-[#8889BD]' : ''}`}> 
                                                <Text className={`font-semibold text-[16px] ${isSelected ? 'text-white' : isAvailable ? (isWeekend ? 'text-red-500' : 'text-black') : 'text-gray-300'}`}>
                                                    {day.getDate()}
                                                </Text>
                                            </View>
                                            {isToday && isAvailable && <View className="w-[6px] h-[6px] bg-[#5F60A2] rounded-full" />}
                                        </Pressable>
                                    );
                                })}
                            </View>
                        ))}
                    </View>

                    {/* 하단 버튼 */}
                    <View className="flex-row items-center gap-[10px] w-[362px] mx-auto mt-6">
                        <Pressable
                            className="w-[85px] h-[45px] flex-row justify-center items-center border border-[#E0E0E0] rounded-[7px]"
                            onPress={closeCalendar}
                        >
                            <Text className="font-bold text-[14px] text-black">닫기</Text>
                        </Pressable>
                        <Pressable
                            className="flex-1 h-[45px] flex-row justify-center items-center bg-[#8889BD] rounded-[7px]"
                            onPress={applyCalendar}
                        >
                            <Text className="font-bold text-[14px] text-white">결과보기</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
