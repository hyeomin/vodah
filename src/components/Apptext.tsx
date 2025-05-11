import React from "react";
import { Text, TextProps, TextStyle } from "react-native";

interface AppTextProps extends TextProps {
    weight?: "regular" | "bold" | "semibold";
}

const weightMap: Record<
    NonNullable<AppTextProps["weight"]>,
    TextStyle["fontWeight"]
> = {
    regular: "400",
    semibold: "600",
    bold: "700",
};

export default function AppText({
    children,
    weight = "regular",
    className,
    style,
    ...props
}: AppTextProps) {
    return (
        <Text
            className={className}
            style={[{ fontWeight: weightMap[weight] }, style]}
            {...props}
        >
            {children}
        </Text>
    );
}
