import {
    YogaClassDB,
    enrichYogaClass,
    transformYogaClass,
} from "@/utils/transformers";
import { useMemo } from "react";
import { DifficultyLevel, LocationType, YogaClass } from "../types/types";
import { useLocations } from "./useLocation";
import { useSupabase } from "./useSupabase";

type YogaClassFields = keyof YogaClass;

export function useYogaClasses(options?: {
    difficulty?: DifficultyLevel;
    isIndoor?: LocationType;
    instructorId?: string;
    tagIds?: string[];
    fields?: YogaClassFields[]; // Specify which fields to fetch
}) {
    const filters = [];

    if (options?.difficulty) {
        filters.push({ column: "difficulty", value: options.difficulty });
    }
    if (options?.isIndoor) {
        filters.push({ column: "is_indoor", value: options.isIndoor });
    }
    if (options?.tagIds?.length) {
        filters.push({ column: "tag_ids", value: options.tagIds });
    }

    // If no specific fields are requested, fetch all fields
    const selectFields = options?.fields?.length
        ? options.fields.join(", ")
        : "*";

    const { data, loading, error, refetch } = useSupabase<YogaClassDB>(
        "yoga_classes",
        {
            select: selectFields,
            filter: filters,
            order: { column: "created_at", ascending: false },
        }
    );

    // Get all unique location IDs and studio IDs from yoga classes
    const { locationIds, studioIds } = useMemo(() => {
        if (!data) return { locationIds: [], studioIds: [] };
        const locationIds = data
            .map((yc) => yc.location_id)
            .filter((id): id is string => id !== null);
        const studioIds = data
            .map((yc) => yc.studio_id)
            .filter((id): id is string => id !== null);
        return { locationIds, studioIds };
    }, [data]);

    // Fetch locations and studios data
    const { data: locations, loading: loadingLocations } =
        useLocations(locationIds);
    const { data: studios, loading: loadingStudios } = useSupabase<{
        id: string;
        name: string;
        location_id: string;
    }>("yoga_studios", {
        select: "*",
        filter:
            studioIds.length > 0 ? [{ column: "id", value: studioIds }] : [],
    });

    const { data: classToTags, loading: loadingClassToTags } = useSupabase<{
        yoga_class_id: string;
        tag_id: string;
      }>("yoga_class_to_tag");

    const classIdToTagIds = useMemo(() => {
        const map: Record<string, string[]> = {};
        if (!classToTags) return map;
        classToTags.forEach(({ yoga_class_id, tag_id }) => {
          if (!map[yoga_class_id]) map[yoga_class_id] = [];
          map[yoga_class_id].push(tag_id);
        });
        return map;
    }, [classToTags]);

    // Transform and enrich yoga classes with location and studio data
    const transformedData = useMemo(() => {
        if (!data || !locations || !studios) return [];
        return data.map((yc) => {
            const transformed = transformYogaClass(yc);
            const location = yc.location_id
                ? locations.find((l) => l.id === yc.location_id) || null
                : null;
            const studio = yc.studio_id
                ? studios.find((s) => s.id === yc.studio_id)
                : null;
            const studioLocation = studio
                ? locations.find((l) => l.id === studio.location_id) || null
                : null;
            
            const tagIds = classIdToTagIds[yc.id] ?? [];

            return enrichYogaClass(
                { ...transformed, tagIds},
                studio && studioLocation
                    ? {
                          id: studio.id,
                          name: studio.name,
                          location: studioLocation,
                      }
                    : null,
                location
            );
        });
    }, [data, locations, studios]);

    const isAnyLoading = loading || loadingLocations || loadingStudios;

    return {
        data: transformedData,
        loading: isAnyLoading,
        error,
        refetch,
    };
}
