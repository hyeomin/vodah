import { TimeSlotDB, transformTimeSlot } from "@/utils/transformers";
import { useSupabase } from "./useSupabase";

export function useTimeSlots(options?: {
    classId?: string;
    startDate?: Date;
    endDate?: Date;
}) {
    const filters = [];

    if (options?.classId) {
        filters.push({ column: "class_id", value: options.classId });
    }
    if (options?.startDate) {
        filters.push({
            column: "start_time",
            value: options.startDate.toISOString(),
        });
    }
    if (options?.endDate) {
        filters.push({
            column: "end_time",
            value: options.endDate.toISOString(),
        });
    }

    const { data, loading, error, refetch } = useSupabase<TimeSlotDB>(
        "time_slots",
        {
            select: "*",
            filter: filters,
            order: { column: "start_time", ascending: true },
        }
    );

    const transformedData = data?.map(transformTimeSlot);

    return { data: transformedData, loading, error, refetch };
}
