import { InstructorDB, transformInstructor } from "@/utils/transformers";
import { useSupabase } from "./useSupabase";

export function useInstructors(options?: { instructorId?: string }) {
    const filters = [];

    if (options?.instructorId) {
        filters.push({ column: "id", value: options.instructorId });
    }

    const { data, loading, error, refetch } = useSupabase<InstructorDB>(
        "instructors",
        {
            select: "*",
            filter: filters,
            order: { column: "created_at", ascending: false },
        }
    );

    const transformedData = data?.map(transformInstructor);

    return { data: transformedData, loading, error, refetch };
}
