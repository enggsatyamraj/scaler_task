"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import MessageList from "./message-list";
import MessageInput from "./message-input";
import LeetcodeInput from "./leetcode-input";
import { Card, CardContent } from "./ui/card";

export default function ChatInterface() {
    const { data: session } = useSession();
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [leetcodeUrl, setLeetcodeUrl] = useState("");
    const messagesEndRef = useRef(null);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const addMessage = (content, sender) => {
        setMessages((prev) => [...prev, { content, sender, timestamp: new Date() }]);
    };

    const handleSendMessage = async (message) => {
        if (!message.trim() || !session) return;

        addMessage(message, "user");
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message,
                    leetcodeUrl,
                    messageHistory: messages,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to get response");
            }

            const data = await response.json();
            addMessage(data.response, "assistant");
        } catch (error) {
            console.error("Error:", error);
            addMessage("Sorry, I encountered an error. Please try again.", "assistant");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSetLeetcodeUrl = (url) => {
        setLeetcodeUrl(url);
        addMessage(`LeetCode problem set to: ${url}`, "system");
    };

    return (
        <Card className="w-full">
            <CardContent className="p-4">
                <div className="flex flex-col h-[80vh]">
                    <LeetcodeInput onSubmit={handleSetLeetcodeUrl} />

                    <div className="flex-1 overflow-y-auto mb-4 mt-4">
                        <MessageList messages={messages} />
                        <div ref={messagesEndRef} />
                    </div>

                    <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
                </div>
            </CardContent>
        </Card>
    );
}