import { ReservationDB, transformReservation } from "@/utils/transformers";
import { PaymentStatus, ReservationStatus } from "../types/types";
import { useSupabase } from "./useSupabase";

export function useReservations(options?: {
    userId?: string;
    timeslotId?: string;
    status?: ReservationStatus;
    paymentStatus?: PaymentStatus;
}) {
    const filters = [];

    if (options?.userId) {
        filters.push({ column: "user_id", value: options.userId });
    }
    if (options?.timeslotId) {
        filters.push({ column: "timeslot_id", value: options.timeslotId });
    }
    if (options?.status) {
        filters.push({ column: "status", value: options.status });
    }
    if (options?.paymentStatus) {
        filters.push({
            column: "payment_status",
            value: options.paymentStatus,
        });
    }

    const { data, loading, error, refetch } = useSupabase<ReservationDB>(
        "reservations",
        {
            select: "*",
            filter: filters,
            order: { column: "booked_at", ascending: false },
        }
    );

    const transformedData = data?.map(transformReservation);

    return { data: transformedData, loading, error, refetch };
}
