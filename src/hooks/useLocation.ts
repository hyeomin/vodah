import { LocationDB, transformLocation } from "@/utils/transformers";
import { useSupabase } from "./useSupabase";

export function useLocation(locationId: string | null) {
    const { data, loading, error, refetch } = useSupabase<LocationDB>(
        "locations",
        {
            select: "*",
            filter: locationId ? [{ column: "id", value: locationId }] : [],
        }
    );

    return {
        data: data?.[0] ? transformLocation(data[0]) : null,
        loading,
        error,
        refetch,
    };
}

export function useLocations(locationIds: string[]) {
    const { data, loading, error, refetch } = useSupabase<LocationDB>(
        "locations",
        {
            select: "*",
            filter:
                locationIds.length > 0
                    ? [{ column: "id", operator: "in", value: locationIds }]
                    : [],
        }
    );

    return {
        data: data ? data.map(transformLocation) : [],
        loading,
        error,
        refetch,
    };
}
