export type ReservationStatus =
    | "pending"
    | "confirmed"
    | "cancelled"
    | "completed"
    | "no_show";

export type PaymentStatus = "unpaid" | "paid" | "refunded";

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
    cover_image_url: string;
    tagIds: string[];
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
