"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

import { useEffect, useState } from "react";

export function SwitchTheme() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    return (
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {mounted && theme === "dark" ? (
                <Sun className="h-[1.2rem] w-[1.2rem]" />
            ) : mounted ? (
                <Moon className="h-[1.2rem] w-[1.2rem]" />
            ) : null}
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}