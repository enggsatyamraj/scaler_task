// components/theme-provider.jsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({ setTheme: () => null, theme: "system" });

export function ThemeProvider({
    children,
    defaultTheme = "system",
    enableSystem = true,
    ...props
}) {
    const [theme, setTheme] = useState(() => {
        // Try to get theme from localStorage on client side
        if (typeof window !== "undefined") {
            const savedTheme = localStorage.getItem("theme");
            return savedTheme || defaultTheme;
        }
        return defaultTheme;
    });

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");

        if (theme === "system" && enableSystem) {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
                .matches
                ? "dark"
                : "light";
            root.classList.add(systemTheme);
            return;
        }

        root.classList.add(theme);
    }, [theme, enableSystem]);

    const value = {
        theme,
        setTheme: (newTheme) => {
            localStorage.setItem("theme", newTheme);
            setTheme(newTheme);
        },
    };

    return (
        <ThemeContext.Provider {...props} value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined)
        throw new Error("useTheme must be used within a ThemeProvider");
    return context;
};