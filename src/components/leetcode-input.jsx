"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

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
        <Card className="mb-4">
            <CardContent className="pt-4">
                <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                        <Input
                            type="text"
                            placeholder="Enter LeetCode problem URL"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="flex-1"
                        />
                        <Button type="submit">Set Problem</Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Example: https://leetcode.com/problems/two-sum/
                    </p>
                </form>
            </CardContent>
        </Card>
    );
}