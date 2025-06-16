export type ReservationStatus =
    | "pending"
    | "confirmed"
    | "cancelled"
    | "completed"
    | "no_show";

export type PaymentStatus = "unpaid" | "paid" | "refunded";

export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

export const DIFFICULTY_LEVELS: DifficultyLevel[] = [
    "beginner",
    "intermediate",
    "advanced",
];

export const DIFFICULTY_DISPLAY_NAMES: Record<DifficultyLevel, string> = {
    beginner: "입문",
    intermediate: "중급",
    advanced: "고급",
};

export type LocationType = "indoor" | "outdoor";

export const LOCATION_TYPE = {
    INDOOR: "indoor",
    OUTDOOR: "outdoor",
} as const;

export const LOCATION_DISPLAY_NAMES: Record<LocationType, string> = {
    indoor: "실내",
    outdoor: "실외",
};

export interface Instructor {
    id: string;
    name: string;
    bio: string | null;
    imageUrl: string | null;
    instagram?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface YogaClassTag {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Location {
    id: string;
    roadAddress: string;
    city: string | null;
    gu: string | null;
    dong: string | null;
    latitude: number | null;
    longitude: number | null;
    dongAddress: string | null;
    locationName: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface YogaClass {
    id: string;
    title: string;
    description: string | null;
    detailPostUrl: string | null;
    instructorId: string | null;
    imageUrls: string[];
    tagIds: string[];
    difficulty: DifficultyLevel;
    isIndoor: LocationType;
    studioId: string | null;
    locationId: string | null;
    location: Location | null;
    createdAt: Date;
    updatedAt: Date;
    tagNames: string[];
}

export interface User {
    id: string;
    name: string;
    phone: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface TimeSlot {
    id: string;
    classId: string;
    startTime: Date;
    endTime: Date;
    capacity: number;
    price: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Reservation {
    id: string;
    timeslotId: string;
    userId: string;
    bookedAt: Date;
    status: ReservationStatus;
    paymentStatus: PaymentStatus;
    createdAt: Date;
    updatedAt: Date;
    consents: {
        agreed_to_terms: boolean;
        terms_agreed_at: string;
        agreed_to_refund_policy: boolean;
        refund_agreed_at: string;
    };
}
