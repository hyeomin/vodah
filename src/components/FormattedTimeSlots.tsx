import { EnrichedTimeSlot } from "@/dummyData";
import React from "react";
import { View } from "react-native";
import AppText from "./Apptext";

interface FormattedTimeSlotsProps {
    timeSlots: EnrichedTimeSlot[];
    classId: string;
    className?: string;
}

export default function FormattedTimeSlots({
    timeSlots,
    classId,
    className,
}: FormattedTimeSlotsProps) {
    const formattedDates = (() => {
        const dates = timeSlots
            .filter((slot) => slot.classId === classId && !slot.isFull)
            .map((slot) => slot.startTime)
            .sort((a, b) => a.getTime() - b.getTime());

        if (dates.length === 0) {
            return (
                <AppText className={className}>
                    예약 가능한 날짜가 없습니다
                </AppText>
            );
        }

        const groupedDates = dates.reduce((acc, date) => {
            const month = date.getMonth() + 1;
            const day = date.getDate();
            if (!acc[month]) {
                acc[month] = [];
            }
            acc[month].push(day);
            return acc;
        }, {} as Record<number, number[]>);

        return Object.entries(groupedDates).map(
            ([month, days], index, array) => {
                const sortedDays = days.sort((a, b) => a - b);
                return (
                    <React.Fragment key={month}>
                        <AppText weight="semibold" className={className}>
                            {month}월{" "}
                        </AppText>
                        <AppText className={className}>
                            {sortedDays.join("일, ")}일
                        </AppText>
                        {index < array.length - 1 && (
                            <AppText className={className}>, </AppText>
                        )}
                    </React.Fragment>
                );
            }
        );
    })();

    return <View className="flex-row">{formattedDates}</View>;
}
