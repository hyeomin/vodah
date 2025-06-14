import { Path, Svg } from "react-native-svg";

interface TabIconProps {
    color: string;
    size?: number;
    name: "home" | "calendar";
}

export default function TabIcon({ color, size = 22, name }: TabIconProps) {
    if (name === "home") {
        return (
            <Svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <Path
                    d="M1.375 8.25V20.625H8.25V15.125C8.25 13.6062 9.48122 12.375 11 12.375C12.5188 12.375 13.75 13.6062 13.75 15.125V20.625H20.625V8.25L11 0L1.375 8.25Z"
                    fill={color}
                />
            </Svg>
        );
    }

    return (
        <Svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <Path
                d="M8.25 0H4.125V2.75H1.375V6.875H20.625V2.75H17.875V0H13.75V2.75H8.25V0Z"
                fill={color}
            />
            <Path d="M20.625 9.625H1.375V20.625H20.625V9.625Z" fill={color} />
        </Svg>
    );
}
