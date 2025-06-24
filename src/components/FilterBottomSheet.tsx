import AppText from "@/components/Apptext";
import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetHandle,
    BottomSheetScrollView,
    BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { useCallback, useMemo, useRef } from "react";
import { Pressable, View } from "react-native";

interface FilterBottomSheetProps {
    bottomSheetRef: React.RefObject<any>;
    selectedTab: "region" | "tag";
    tempSelectedCity: string | null;
    tempSelectedDistricts: string[];
    tempSelectedTags: string[];
    uniqueCities: string[];
    uniqueDistricts: string[];
    tags: Array<{ id: string; name: string }>;
    onRegionTabPress: () => void;
    onTagTabPress: () => void;
    onClose: () => void;
    onShowResults: () => void;
    onTempSelectedCityChange: (city: string | null) => void;
    onTempSelectedDistrictsChange: (districts: string[]) => void;
    onTempSelectedTagsChange: (tags: string[]) => void;
}

export default function FilterBottomSheet({
    bottomSheetRef,
    selectedTab,
    tempSelectedCity,
    tempSelectedDistricts,
    tempSelectedTags,
    uniqueCities,
    uniqueDistricts,
    tags,
    onRegionTabPress,
    onTagTabPress,
    onClose,
    onShowResults,
    onTempSelectedCityChange,
    onTempSelectedDistrictsChange,
    onTempSelectedTagsChange,
}: FilterBottomSheetProps) {
    const snapPoints = useMemo(() => ["25%", "75%"], []);
    const regionContentRef = useRef<View>(null);
    const tagContentRef = useRef<View>(null);
    const scrollViewRef = useRef<any>(null);

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

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            snapPoints={snapPoints}
            backgroundStyle={{ backgroundColor: "#F9F8F5" }}
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
            <BottomSheetView className="filter-tab-container border-b border-border flex-row px-[20px] gap-[10px] absolute top-0 left-0 right-0 z-10">
                <Pressable onPress={onRegionTabPress}>
                    <AppText
                        className={`filter-name-region self-start text-[15px] p-[10px] ${
                            selectedTab === "region" &&
                            "border-b-2 border-black"
                        }`}
                    >
                        지역
                    </AppText>
                </Pressable>
                <Pressable onPress={onTagTabPress}>
                    <AppText
                        className={`filter-name-tag self-start text-[15px] p-[10px] ${
                            selectedTab === "tag" && "border-b-2 border-black"
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
                                            onTempSelectedCityChange(
                                                tempSelectedCity === city
                                                    ? null
                                                    : city
                                            );
                                        onTempSelectedDistrictsChange([]);
                                    }}
                                >
                                    <AppText
                                        weight={
                                            tempSelectedCity === city
                                                ? "bold"
                                                : "medium"
                                        }
                                        className={`text-[14px] text-center ${
                                            tempSelectedCity === city &&
                                            "text-primary"
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
                                                className={`px-[10px] py-[7px] rounded-[7px] ${
                                                    tempSelectedDistricts.includes(
                                                        district
                                                    )
                                                        ? "bg-primary"
                                                        : "bg-white"
                                                }`}
                                                onPress={() => {
                                                    onTempSelectedDistrictsChange(
                                                        tempSelectedDistricts.includes(
                                                            district
                                                        )
                                                            ? tempSelectedDistricts.filter(
                                                                  (d) =>
                                                                      d !==
                                                                      district
                                                              )
                                                            : [
                                                                  ...tempSelectedDistricts,
                                                                  district,
                                                              ]
                                                    );
                                                }}
                                            >
                                                <AppText
                                                    className={` ${
                                                        tempSelectedDistricts.includes(
                                                            district
                                                        ) && "text-white"
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
                                    className={`px-[10px] py-[7px] rounded-[7px] ${
                                        tempSelectedTags.includes(tag.id)
                                            ? "bg-primary"
                                            : "bg-white"
                                    }`}
                                    onPress={() => {
                                        onTempSelectedTagsChange(
                                            tempSelectedTags.includes(tag.id)
                                                ? tempSelectedTags.filter(
                                                      (id) => id !== tag.id
                                                  )
                                                : [...tempSelectedTags, tag.id]
                                        );
                                    }}
                                >
                                    <AppText
                                        className={`${
                                            tempSelectedTags.includes(tag.id) &&
                                            "text-white"
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
            <BottomSheetView className="footer-container px-[20px] py-[10px] gap-[10px]">
                <View className="flex-row flex-wrap gap-[8px]">
                    {tempSelectedDistricts.map((district) => (
                        <Pressable
                            key={district}
                            onPress={() => {
                                onTempSelectedDistrictsChange(
                                    tempSelectedDistricts.filter(
                                        (d) => d !== district
                                    )
                                );
                            }}
                        >
                            <View className="border border-primary bg-primary/15 px-[10px] py-[7px] rounded-[7px]">
                                <AppText className="text-textSecondary">
                                    {district}
                                </AppText>
                            </View>
                        </Pressable>
                    ))}
                    {tempSelectedTags.map((tagId) => {
                        const tag = tags.find((t) => t.id === tagId);
                        return tag ? (
                            <Pressable
                                key={tagId}
                                onPress={() => {
                                    onTempSelectedTagsChange(
                                        tempSelectedTags.filter(
                                            (id) => id !== tagId
                                        )
                                    );
                                }}
                            >
                                <View className="border border-primary bg-primary/15 px-[10px] py-[7px] rounded-[7px]">
                                    <AppText className="text-textSecondary">
                                        {tag.name}
                                    </AppText>
                                </View>
                            </Pressable>
                        ) : null;
                    })}
                </View>
                <View className="flex-row gap-[10px]">
                    <Pressable
                        className="bg-white py-[15px] px-[40px] border border-border rounded-[7px] items-center"
                        onPress={onClose}
                    >
                        <AppText className="text-[15px]">닫기</AppText>
                    </Pressable>
                    <Pressable
                        className="flex-1 py-[15px] rounded-[7px] items-center bg-primary"
                        onPress={onShowResults}
                    >
                        <AppText
                            className="text-white text-[15px]"
                            weight="semibold"
                        >
                            결과보기
                        </AppText>
                    </Pressable>
                </View>
            </BottomSheetView>
        </BottomSheet>
    );
}
