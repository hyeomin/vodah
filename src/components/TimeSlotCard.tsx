import React from "react";
import { Pressable, View } from "react-native";
import AppText from "./Apptext";

interface TimeSlotCardProps {
    id: string;
    startTime: Date;
    endTime?: Date;
    title: string;
    price: number;
    isFull?: boolean;
    isSelected?: boolean;
    onPress?: () => void;
}

export default function TimeSlotCard({
    id,
    startTime,
    endTime,
    title,
    price,
    isFull = false,
    isSelected = false,
    onPress,
}: TimeSlotCardProps) {
    const formattedDate = startTime
        .toLocaleString("ko-KR", {
            month: "numeric",
            day: "numeric",
            weekday: "short",
        })
        .replace(".", "/")
        .replace(".", "")
        .replace(/\s+/g, "");

    const formattedStartTime = startTime.toLocaleString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });

    const formattedEndTime = endTime?.toLocaleString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });

    const timeRange = formattedEndTime
        ? `${formattedStartTime} - ${formattedEndTime}`
        : formattedStartTime;

    const priceText = price ? `${price.toLocaleString()}원` : "가격 문의";

    if (isFull) {
        return (
            <View className="one-slot-full bg-border w-[120px] p-[10px] gap-[5px] justify-center items-center rounded-[10px] mr-[15px]">
                <AppText
                    weight="semibold"
                    className="text-[13px] text-tertiary"
                >
                    {formattedDate}
                </AppText>
                <AppText
                    weight="semibold"
                    className="text-[13px] text-tertiary"
                >
                    {timeRange}
                </AppText>
                <AppText
                    weight="semibold"
                    className="text-[15px] text-tertiary"
                >
                    {priceText}
                </AppText>
            </View>
        );
    }

    if (isSelected) {
        return (
            <Pressable
                onPress={onPress}
                className="one-slot-selected bg-primary w-[120px] p-[10px] gap-[5px] justify-center items-center rounded-[10px] mr-[15px]"
            >
                <AppText weight="semibold" className="text-[13px] text-white">
                    {formattedDate}
                </AppText>
                <AppText weight="semibold" className="text-[13px] text-white">
                    {timeRange}
                </AppText>
                <AppText weight="semibold" className="text-[15px] text-white">
                    {priceText}
                </AppText>
            </Pressable>
        );
    }

    return (
        <Pressable
            onPress={onPress}
            className="one-slot-default bg-background border border-border w-[120px] p-[10px] gap-[5px] justify-center items-center rounded-[10px] mr-[15px]"
        >
            <AppText className="text-[13px]">{formattedDate}</AppText>
            <AppText className="text-[13px]">{timeRange}</AppText>
            <AppText weight="medium" className="text-[15px]">
                {priceText}
            </AppText>
        </Pressable>
    );
}
