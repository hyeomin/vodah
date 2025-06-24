import React from "react";
import { Text, TextProps } from "react-native";

interface AppTextProps extends TextProps {
    weight?:
        | "thin"
        | "extralight"
        | "light"
        | "regular"
        | "medium"
        | "semibold"
        | "bold"
        | "extrabold"
        | "black";
    fontFamily?: string;
}

const weightMap: Record<NonNullable<AppTextProps["weight"]>, string> = {
    thin: "Pretendard-Thin",
    extralight: "Pretendard-ExtraLight",
    light: "Pretendard-Light",
    regular: "Pretendard-Regular",
    medium: "Pretendard-Medium",
    semibold: "Pretendard-SemiBold",
    bold: "Pretendard-Bold",
    extrabold: "Pretendard-ExtraBold",
    black: "Pretendard-Black",
};

export default function AppText({
    children,
    weight = "regular",
    fontFamily,
    className,
    style,
    ...props
}: AppTextProps) {
    const finalFontFamily = fontFamily || weightMap[weight];

    return (
        <Text
            className={className}
            style={[{ fontFamily: finalFontFamily }, style]}
            {...props}
        >
            {children}
        </Text>
    );
}
