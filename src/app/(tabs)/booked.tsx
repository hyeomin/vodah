import AppText from "@/components/Apptext";
import { AddressIcon } from "@/components/SvgIcons";
import { enrichedDummyReservations } from "@/dummyData";
import React from "react";
import { FlatList, View } from "react-native";

const BookedScreen = () => {
    const renderReservationCard = ({
        item,
    }: {
        item: (typeof enrichedDummyReservations)[0];
    }) => (
        <View className="card-item rounded-[10px] bg-[#F9F8F5] shadow-[0px_1px_10px_0px_rgba(0,0,0,0.15)] gap-[20px] p-[20px_15px_25px_15px] mx-[20px] my-[10px]">
            <View className="card-header flex-row gap-[10px]">
                <View className="bg-background rounded-[10px] px-[10px] py-[5px]">
                    <AppText>D-7</AppText>
                </View>
                <View className="bg-background rounded-[10px] px-[10px] py-[5px]">
                    <AppText>
                        {item.status === "confirmed"
                            ? "예약 확정"
                            : "예약 대기"}
                    </AppText>
                </View>
            </View>
            <View className="card-item-image bg-gray-200 h-[120px] rounded-[10px]"></View>
            <View className="card-details gap-[7px] px-[7px]">
                <AppText weight="semibold" className="text-[17px]">
                    {item.classTitle}
                </AppText>
                <View className="card-location-container flex-row items-center gap-[5px]">
                    <AddressIcon />
                    <AppText className="text-[13px] text-tertiary">
                        {item.location}
                    </AppText>
                </View>
                <AppText>
                    {item.startTime.toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        weekday: "long",
                    })}{" "}
                    ·{" "}
                    {item.startTime.toLocaleTimeString("ko-KR", {
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                    })}{" "}
                    -{" "}
                    {item.endTime.toLocaleTimeString("ko-KR", {
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                    })}
                </AppText>
            </View>
        </View>
    );

    return (
        <View className="flex-1 bg-background">
            <View className="p-[25px]">
                <AppText weight="semibold" className="text-[18px]">
                    나의 예약
                </AppText>
            </View>
            <FlatList
                data={enrichedDummyReservations}
                renderItem={renderReservationCard}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
};

export default BookedScreen;
