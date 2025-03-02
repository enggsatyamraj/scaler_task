"use client";

import { useState } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

export default function MessageInput({ onSendMessage, isLoading }) {
    const [message, setMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!message.trim() || isLoading) return;

        onSendMessage(message);
        setMessage("");
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
            <Textarea
                placeholder="Ask a question about the problem..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="resize-none min-h-[80px]"
                disabled={isLoading}
            />
            <Button
                type="submit"
                disabled={isLoading || !message.trim()}
                className="self-end"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Thinking...
                    </>
                ) : (
                    "Send"
                )}
            </Button>
        </form>
    );
}