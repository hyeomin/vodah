import AppText from "@/components/Apptext";
import FormattedTimeSlots from "@/components/FormattedTimeSlots";
import { AddressIcon, CalendarIcon } from "@/components/icons/SvgIcons";
import { EnrichedYogaClass } from "@/utils/transformers";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Pressable, View } from "react-native";

interface YogaClassCardProps {
    item: EnrichedYogaClass;
    enrichedTimeSlots: any[]; // TODO: Add proper type
    getMinPriceForClass: (classId: string) => number;
}

export default function YogaClassCard({
    item,
    enrichedTimeSlots,
    getMinPriceForClass,
}: YogaClassCardProps) {
    const router = useRouter();

    const locationInfo = item.studio?.location || item.location;

    return (
        <Pressable
            onPress={() => {
                router.push({
                    pathname: "/class/[classId]",
                    params: { classId: item.id },
                });
            }}
            className="single-card w-full gap-[15px] px-[20px]"
        >
            <View
                key="image"
                className="card-image h-[250px] rounded-[10px] overflow-hidden"
            >
                <Image
                    source={{ uri: item.imageUrls[0] }}
                    className="w-full h-full"
                    resizeMode="cover"
                />
            </View>
            <View key="content" className="card-content gap-[7px] px-[7px]">
                <AppText className="text-[17px]">{item.title}</AppText>
                <View key="meta" className="card-meta-container gap-[5px]">
                    <View
                        key="location"
                        className="card-location-container flex-row items-center gap-[7px]"
                    >
                        <AddressIcon />
                        <AppText className="text-[14px] text-tertiary">
                            {locationInfo?.roadAddress || "위치 정보 없음"}
                        </AppText>
                    </View>
                    <View
                        key="date"
                        className="card-date-container flex-row gap-[7px]"
                    >
                        <CalendarIcon />
                        <AppText className="text-[14px] text-tertiary flex-1">
                            <FormattedTimeSlots
                                timeSlots={enrichedTimeSlots}
                                classId={item.id}
                                className="text-[13px] text-tertiary"
                            />
                        </AppText>
                    </View>
                </View>
                <View
                    key="price"
                    className="card-price-container flex-row items-end gap-[5px]"
                >
                    {getMinPriceForClass(item.id) ? (
                        <>
                            <AppText weight="medium" className="text-[17px]">
                                {`${getMinPriceForClass(
                                    item.id
                                ).toLocaleString()}원~`}
                            </AppText>
                            <AppText className="text-[13px] text-tertiary">
                                / 1회
                            </AppText>
                        </>
                    ) : (
                        <AppText weight="medium" className="text-[17px]">
                            가격문의
                        </AppText>
                    )}
                </View>
            </View>
        </Pressable>
    );
}
