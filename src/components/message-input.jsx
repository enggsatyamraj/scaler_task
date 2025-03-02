"use client";

import { useState } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Loader2, SendIcon } from "lucide-react";

export default function MessageInput({ onSendMessage, isLoading }) {
    const [message, setMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!message.trim() || isLoading) return;

        onSendMessage(message);
        setMessage("");
    };

    const handleKeyDown = (e) => {
        // Send message on Enter without shift key
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!message.trim() || isLoading) return;
            onSendMessage(message);
            setMessage("");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
            <Textarea
                placeholder="Ask a question about the LeetCode problem..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                className="resize-none min-h-[80px] bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700"
                disabled={isLoading}
            />
            <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    Ask for hints, approaches, or a step-by-step walkthrough
                    <span className="ml-2 hidden sm:inline">Press Enter to send</span>
                </p>
                <Button
                    type="submit"
                    disabled={isLoading || !message.trim()}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Thinking...
                        </>
                    ) : (
                        <>
                            <SendIcon className="mr-2 h-4 w-4" />
                            Send
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}