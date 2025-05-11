/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                primary: "#8889BD",
                accent: "#5F60A2",
                textSecondary: "#666666",
                tertiary: "#9CA3AF",
                border: "#E0E0E0",
                fillGray: "#F4F4F4",
                linkBlue: "#0068C3",
                disabled: "#D5D5D5",
                background: "#F6F4F1",
            },
        },
    },
    plugins: [],
};
