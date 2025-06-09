import {
    DifficultyLevel,
    Location,
    LocationType,
    PaymentStatus,
    Reservation,
    ReservationStatus,
    TimeSlot,
    YogaClass,
} from "@/types/types";

// Database response types with snake_case fields
export interface YogaClassDB {
    id: string;
    title: string;
    description: string;
    detail_post_url: string;
    difficulty: DifficultyLevel;
    is_indoor: LocationType;
    instructor_id: string;
    image_urls: string[];
    tag_ids: string[];
    studio_id: string | null;
    location_id: string | null;
    created_at: string;
    updated_at: string;
}

export interface TimeSlotDB {
    id: string;
    class_id: string;
    start_time: string;
    end_time: string;
    capacity: number;
    price: number;
    created_at: string;
    updated_at: string;
}

export interface ReservationDB {
    id: string;
    user_id: string;
    timeslot_id: string;
    status: string;
    payment_status: string;
    booked_at: string;
    created_at: string;
    updated_at: string;
    consents: {
        agreed_to_terms: boolean;
        terms_agreed_at: string;
        agreed_to_refund_policy: boolean;
        refund_agreed_at: string;
    };
}

export interface InstructorDB {
    id: string;
    name: string;
    bio: string;
    profile_image_url: string;
    instagram: string | null;
    created_at: string;
    updated_at: string;
}

export interface LocationDB {
    id: string;
    road_address: string;
    city: string | null;
    gu: string | null;
    dong: string | null;
    latitude: number | null;
    longitude: number | null;
    dong_address: string | null;
    location_name: string | null;
    created_at: string;
    updated_at: string;
}

// Transformation functions
export function transformYogaClass(yogaClass: YogaClassDB): YogaClass {
    return {
        id: yogaClass.id,
        title: yogaClass.title,
        description: yogaClass.description,
        difficulty: yogaClass.difficulty,
        isIndoor: yogaClass.is_indoor,
        instructorId: yogaClass.instructor_id,
        imageUrls: yogaClass.image_urls,
        tagIds: yogaClass.tag_ids,
        detailPostUrl: yogaClass.detail_post_url,
        studioId: yogaClass.studio_id,
        locationId: yogaClass.location_id,
        location: null,
        createdAt: new Date(yogaClass.created_at),
        updatedAt: new Date(yogaClass.updated_at),
    };
}

export function transformTimeSlot(timeSlot: TimeSlotDB): TimeSlot {
    return {
        id: timeSlot.id,
        classId: timeSlot.class_id,
        startTime: new Date(timeSlot.start_time),
        endTime: new Date(timeSlot.end_time),
        capacity: timeSlot.capacity,
        price: timeSlot.price,
        createdAt: new Date(timeSlot.created_at),
        updatedAt: new Date(timeSlot.updated_at),
    };
}

export function transformInstructor(instructor: InstructorDB) {
    return {
        id: instructor.id,
        name: instructor.name,
        bio: instructor.bio,
        imageUrl: instructor.profile_image_url,
        instagram: instructor.instagram,
        createdAt: new Date(instructor.created_at),
        updatedAt: new Date(instructor.updated_at),
    };
}

export function transformReservation(reservation: ReservationDB) {
    return {
        id: reservation.id,
        userId: reservation.user_id,
        timeslotId: reservation.timeslot_id,
        status: reservation.status as ReservationStatus,
        paymentStatus: reservation.payment_status as PaymentStatus,
        bookedAt: new Date(reservation.booked_at),
        createdAt: new Date(reservation.created_at),
        updatedAt: new Date(reservation.updated_at),
        consents: reservation.consents,
    };
}

export function transformLocation(location: LocationDB): Location {
    return {
        id: location.id,
        roadAddress: location.road_address,
        city: location.city,
        gu: location.gu,
        dong: location.dong,
        latitude: location.latitude,
        longitude: location.longitude,
        dongAddress: location.dong_address,
        locationName: location.location_name,
        createdAt: new Date(location.created_at),
        updatedAt: new Date(location.updated_at),
    };
}

// Enrichment functions
export interface EnrichedTimeSlot extends TimeSlot {
    enrolledCount: number;
    isFull: boolean;
}

export function enrichTimeSlots(
    timeSlots: TimeSlot[],
    reservations: Reservation[]
): EnrichedTimeSlot[] {
    return timeSlots.map((slot) => {
        const enrolledCount = reservations.filter(
            (r) => r.timeslotId === slot.id && r.status === "confirmed"
        ).length;
        return {
            ...slot,
            enrolledCount,
            isFull: slot.capacity !== null && enrolledCount >= slot.capacity,
        };
    });
}

export interface EnrichedYogaClass extends YogaClass {
    studio?: {
        id: string;
        name: string;
        location: Location;
    } | null;
    location: Location | null;
}

export function enrichYogaClass(
    yogaClass: YogaClass,
    studio: { id: string; name: string; location: Location } | null,
    location: Location | null
): EnrichedYogaClass {
    return {
        ...yogaClass,
        studio,
        location,
    };
}
