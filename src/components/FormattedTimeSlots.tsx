import { TimeSlot } from "@/types/types";
import React from "react";
import { View } from "react-native";
import AppText from "./Apptext";

interface EnrichedTimeSlot extends TimeSlot {
    enrolledCount: number;
    isFull: boolean;
}

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
    const classTimeSlots = timeSlots.filter((slot) => slot.classId === classId);

    if (classTimeSlots.length === 0) {
        return null;
    }

    // Sort time slots by date
    const sortedTimeSlots = [...classTimeSlots].sort(
        (a, b) => a.startTime.getTime() - b.startTime.getTime()
    );

    // Group dates by month
    const datesByMonth = new Map<number, string[]>();
    sortedTimeSlots.forEach((slot) => {
        const month = slot.startTime.getMonth();
        const day = slot.startTime.getDate();
        const weekday = slot.startTime.toLocaleDateString("ko-KR", {
            weekday: "short",
        });

        if (!datesByMonth.has(month)) {
            datesByMonth.set(month, []);
        }
        datesByMonth.get(month)?.push(`${day}일(${weekday})`);
    });

    // Format the dates
    const formattedDates = Array.from(datesByMonth.entries()).map(
        ([month, days]) => {
            const monthName = new Date(2024, month).toLocaleDateString(
                "ko-KR",
                { month: "long" }
            );
            return `${monthName} ${days.join(", ")}`;
        }
    );

    return (
        <View>
            <AppText className={className}>{formattedDates.join(", ")}</AppText>
        </View>
    );
}
