"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function LeetcodeInput({ onSubmit }) {
    const [url, setUrl] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!url.trim()) return;

        // Simple validation for LeetCode URL
        if (!url.includes("leetcode.com/problems/")) {
            alert("Please enter a valid LeetCode problem URL");
            return;
        }

        onSubmit(url);
        setUrl("");
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
            <Input
                type="text"
                placeholder="Enter LeetCode problem URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700"
            />
            <Button
                type="submit"
                className="w-full"
            >
                Set Problem
            </Button>
            <p className="text-xs text-gray-500 dark:text-gray-400">
                Example: https://leetcode.com/problems/two-sum/
            </p>
        </form>
    );
}