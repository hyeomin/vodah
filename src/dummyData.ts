import {
    Instructor,
    PaymentStatus,
    Reservation,
    ReservationStatus,
    TimeSlot,
    User,
    YogaClass,
    YogaClassTag,
} from "./types/types";

export const dummyInstructors: Instructor[] = [
    {
        id: "inst_001",
        name: "김민지",
        bio: "10년 경력의 하타 요가 전문가입니다. 명상과 호흡법에 특화되어 있습니다.",
        imageUrl: "https://example.com/instructor1.jpg",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
    },
    {
        id: "inst_002",
        name: "이준호",
        bio: "아쉬탕가 요가 마스터. 인도에서 5년간 수련했습니다.",
        imageUrl: "https://example.com/instructor2.jpg",
        createdAt: new Date("2024-01-02"),
        updatedAt: new Date("2024-01-02"),
    },
    {
        id: "inst_003",
        name: "박소연",
        bio: "빈야사 플로우 전문가. 초보자부터 고급자까지 모두를 위한 수업을 제공합니다.",
        imageUrl: "https://example.com/instructor3.jpg",
        createdAt: new Date("2024-01-03"),
        updatedAt: new Date("2024-01-03"),
    },
    {
        id: "inst_004",
        name: "최현우",
        bio: "힐링 요가 전문가. 스트레스 해소와 명상에 중점을 둡니다.",
        imageUrl: "https://example.com/instructor4.jpg",
        createdAt: new Date("2024-01-04"),
        updatedAt: new Date("2024-01-04"),
    },
    {
        id: "inst_005",
        name: "정다은",
        bio: "파워 요가 전문가. 근력 강화와 유연성 향상에 특화되어 있습니다.",
        imageUrl: "https://example.com/instructor5.jpg",
        createdAt: new Date("2024-01-05"),
        updatedAt: new Date("2024-01-05"),
    },
];

export const dummyTags: YogaClassTag[] = [
    {
        id: "tag_001",
        name: "초급",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
    },
    {
        id: "tag_002",
        name: "중급",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
    },
    {
        id: "tag_003",
        name: "힐링",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
    },
    {
        id: "tag_004",
        name: "아쉬탕가",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
    },
    {
        id: "tag_005",
        name: "저녁",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
    },
];

export const dummyYogaClasses: YogaClass[] = [
    {
        id: "class_001",
        title: "아침 명상 요가",
        location: {
            fullAddress: "서울시 강남구 테헤란로 123 강남센터 3층",
            city: "서울시",
            gu: "강남구",
            dong: "역삼동",
        },
        description:
            "하루를 시작하는 상쾌한 아침 요가 수업입니다. 하루를 시작하는 상쾌한 아침 요가 수업입니다. 하루를 시작하는 상쾌한 아침 요가 수업입니다. 하루를 시작하는 상쾌한 아침 요가 수업입니다.",
        instructorId: "inst_001",
        cover_image_url: "https://example.com/morning-yoga.jpg",
        tagIds: ["tag_001", "tag_003", "tag_004"], // 초급, 힐링, 아쉬탕가
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
    },
    {
        id: "class_002",
        title: "파워 빈야사",
        location: {
            fullAddress: "서울시 마포구 홍대로 456 홍대센터 2층",
            city: "서울시",
            gu: "마포구",
            dong: "서교동",
        },
        description: "활력 넘치는 동적 요가 수업입니다.",
        instructorId: "inst_002",
        cover_image_url: "https://example.com/power-vinyasa.jpg",
        tagIds: ["tag_002"], // 중급
        createdAt: new Date("2024-01-02"),
        updatedAt: new Date("2024-01-02"),
    },
    {
        id: "class_003",
        title: "힐링 음악 요가",
        location: {
            fullAddress: "서울시 서초구 서초대로 789 서초센터 4층",
            city: "서울시",
            gu: "서초구",
            dong: "서초동",
        },
        description: "음악과 함께하는 편안한 요가 수업입니다.",
        instructorId: "inst_003",
        cover_image_url: "https://example.com/healing-yoga.jpg",
        tagIds: ["tag_003"], // 힐링
        createdAt: new Date("2024-01-03"),
        updatedAt: new Date("2024-01-03"),
    },
    {
        id: "class_004",
        title: "아쉬탕가 기초",
        location: {
            fullAddress: "서울시 송파구 올림픽로 321 잠실센터 5층",
            city: "서울시",
            gu: "송파구",
            dong: "잠실동",
        },
        description: "아쉬탕가 요가의 기본을 배우는 수업입니다.",
        instructorId: "inst_004",
        cover_image_url: "https://example.com/ashtanga-basic.jpg",
        tagIds: ["tag_004"], // 아쉬탕가
        createdAt: new Date("2024-01-04"),
        updatedAt: new Date("2024-01-04"),
    },
    {
        id: "class_005",
        title: "저녁 릴랙스 요가",
        location: {
            fullAddress: "서울시 송파구 송파대로 567 송파센터 6층",
            city: "서울시",
            gu: "송파구",
            dong: "송파동",
        },
        description: "하루의 피로를 풀어주는 저녁 요가 수업입니다.",
        instructorId: "inst_005",
        cover_image_url: "https://example.com/evening-relax.jpg",
        tagIds: ["tag_005"], // 저녁
        createdAt: new Date("2024-01-05"),
        updatedAt: new Date("2024-01-05"),
    },
];

export const dummyUsers: User[] = [
    {
        id: "user_001",
        name: "김지영",
        phone: "010-1234-5678",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
    },
    {
        id: "user_002",
        name: "이민수",
        phone: "010-2345-6789",
        createdAt: new Date("2024-01-02"),
        updatedAt: new Date("2024-01-02"),
    },
    {
        id: "user_003",
        name: "박서연",
        phone: "010-3456-7890",
        createdAt: new Date("2024-01-03"),
        updatedAt: new Date("2024-01-03"),
    },
    {
        id: "user_004",
        name: "최준호",
        phone: "010-4567-8901",
        createdAt: new Date("2024-01-04"),
        updatedAt: new Date("2024-01-04"),
    },
    {
        id: "user_005",
        name: "정다혜",
        phone: "010-5678-9012",
        createdAt: new Date("2024-01-05"),
        updatedAt: new Date("2024-01-05"),
    },
];

export const dummyTimeSlots: TimeSlot[] = [
    // Class 001 - Morning Meditation Yoga
    {
        id: "slot_001",
        classId: "class_001",
        startTime: new Date("2024-05-11T06:00:00"),
        endTime: new Date("2024-05-11T07:00:00"),
        capacity: 15,
        price: 25000,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
    },
    {
        id: "slot_002",
        classId: "class_001",
        startTime: new Date("2024-05-15T08:00:00"),
        endTime: new Date("2024-05-15T09:00:00"),
        capacity: 12,
        price: 28000,
        createdAt: new Date("2024-01-02"),
        updatedAt: new Date("2024-01-02"),
    },
    // Class 002 - Power Vinyasa
    {
        id: "slot_003",
        classId: "class_002",
        startTime: new Date("2024-05-12T10:00:00"),
        endTime: new Date("2024-05-12T11:00:00"),
        capacity: 10,
        price: 30000,
        createdAt: new Date("2024-01-03"),
        updatedAt: new Date("2024-01-03"),
    },
    {
        id: "slot_004",
        classId: "class_002",
        startTime: new Date("2024-05-16T14:00:00"),
        endTime: new Date("2024-05-16T15:00:00"),
        capacity: 8,
        price: 32000,
        createdAt: new Date("2024-01-04"),
        updatedAt: new Date("2024-01-04"),
    },
    // Class 003 - Healing Music Yoga
    {
        id: "slot_005",
        classId: "class_003",
        startTime: new Date("2024-05-13T16:00:00"),
        endTime: new Date("2024-05-13T17:00:00"),
        capacity: 10,
        price: 35000,
        createdAt: new Date("2024-01-05"),
        updatedAt: new Date("2024-01-05"),
    },
    {
        id: "slot_006",
        classId: "class_003",
        startTime: new Date("2024-05-17T18:00:00"),
        endTime: new Date("2024-05-17T19:00:00"),
        capacity: 12,
        price: 38000,
        createdAt: new Date("2024-01-06"),
        updatedAt: new Date("2024-01-06"),
    },
    // Class 004 - Ashtanga Basics
    {
        id: "slot_007",
        classId: "class_004",
        startTime: new Date("2024-05-14T09:00:00"),
        endTime: new Date("2024-05-14T10:00:00"),
        capacity: 8,
        price: 40000,
        createdAt: new Date("2024-01-07"),
        updatedAt: new Date("2024-01-07"),
    },
    {
        id: "slot_008",
        classId: "class_004",
        startTime: new Date("2024-05-18T11:00:00"),
        endTime: new Date("2024-05-18T12:00:00"),
        capacity: 10,
        price: 42000,
        createdAt: new Date("2024-01-08"),
        updatedAt: new Date("2024-01-08"),
    },
    // Class 005 - Evening Relax Yoga
    {
        id: "slot_009",
        classId: "class_005",
        startTime: new Date("2024-05-19T19:00:00"),
        endTime: new Date("2024-05-19T20:00:00"),
        capacity: 12,
        price: 45000,
        createdAt: new Date("2024-01-09"),
        updatedAt: new Date("2024-01-09"),
    },
    {
        id: "slot_010",
        classId: "class_005",
        startTime: new Date("2024-05-20T20:00:00"),
        endTime: new Date("2024-05-20T21:00:00"),
        capacity: 15,
        price: 48000,
        createdAt: new Date("2024-01-10"),
        updatedAt: new Date("2024-01-10"),
    },
];

export const dummyReservations: Reservation[] = [
    // Fill slot_001 (15/15 capacity)
    {
        id: "res_001",
        timeslotId: "slot_001",
        userId: "user_001",
        bookedAt: new Date("2024-03-15T10:00:00"),
        status: "confirmed" as ReservationStatus,
        paymentStatus: "paid" as PaymentStatus,
        createdAt: new Date("2024-03-15"),
        updatedAt: new Date("2024-03-15"),
    },
    // Fill slot_003 (10/10 capacity)
    {
        id: "res_002",
        timeslotId: "slot_003",
        userId: "user_002",
        bookedAt: new Date("2024-03-15T11:00:00"),
        status: "confirmed" as ReservationStatus,
        paymentStatus: "paid" as PaymentStatus,
        createdAt: new Date("2024-03-15"),
        updatedAt: new Date("2024-03-15"),
    },
    // Fill slot_005 (10/10 capacity)
    {
        id: "res_003",
        timeslotId: "slot_005",
        userId: "user_003",
        bookedAt: new Date("2024-03-15T12:00:00"),
        status: "confirmed" as ReservationStatus,
        paymentStatus: "paid" as PaymentStatus,
        createdAt: new Date("2024-03-15"),
        updatedAt: new Date("2024-03-15"),
    },
    // Fill slot_007 (8/8 capacity)
    {
        id: "res_004",
        timeslotId: "slot_007",
        userId: "user_004",
        bookedAt: new Date("2024-03-15T13:00:00"),
        status: "confirmed" as ReservationStatus,
        paymentStatus: "paid" as PaymentStatus,
        createdAt: new Date("2024-03-15"),
        updatedAt: new Date("2024-03-15"),
    },
    // Fill slot_009 (12/12 capacity)
    {
        id: "res_005",
        timeslotId: "slot_009",
        userId: "user_005",
        bookedAt: new Date("2024-03-15T14:00:00"),
        status: "confirmed" as ReservationStatus,
        paymentStatus: "paid" as PaymentStatus,
        createdAt: new Date("2024-03-15"),
        updatedAt: new Date("2024-03-15"),
    },
];

export interface EnrichedReservation extends Reservation {
    classTitle: string;
    location: string;
    startTime: Date;
    endTime: Date;
}

export const enrichedDummyReservations: EnrichedReservation[] =
    dummyReservations.map((reservation) => {
        const timeslot = dummyTimeSlots.find(
            (ts) => ts.id === reservation.timeslotId
        );
        const yogaClass = dummyYogaClasses.find(
            (yc) => yc.id === timeslot?.classId
        );

        return {
            ...reservation,
            classTitle: yogaClass?.title || "Unknown Class",
            location: yogaClass?.location?.fullAddress || "Unknown Location",
            startTime: timeslot?.startTime || new Date(),
            endTime: timeslot?.endTime || new Date(),
        };
    });

// Helper function to compute enrollment count for a time slot
export const getEnrollmentCount = (timeslotId: string): number => {
    return dummyReservations.filter(
        (reservation) =>
            reservation.timeslotId === timeslotId &&
            reservation.status === "confirmed"
    ).length;
};

export interface EnrichedTimeSlot extends TimeSlot {
    enrolledCount: number;
    isFull: boolean;
}

export const enrichedDummyTimeSlots: EnrichedTimeSlot[] = dummyTimeSlots.map(
    (timeslot) => ({
        ...timeslot,
        enrolledCount: getEnrollmentCount(timeslot.id),
        isFull: getEnrollmentCount(timeslot.id) >= timeslot.capacity,
    })
);
