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
    fullAddress: string;
    city: string;
    gu: string;
    dong: string;
}

export interface YogaClass {
    id: string;
    title: string;
    location: Location | null;
    description: string | null;
    instructorId: string | null;
    image_urls: string[];
    tagIds: string[];
    difficulty: DifficultyLevel;
    isIndoor: LocationType;
    createdAt: Date;
    updatedAt: Date;
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
}
