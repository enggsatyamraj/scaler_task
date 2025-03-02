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
    const [streamingMessage, setStreamingMessage] = useState("");
    const [isStreaming, setIsStreaming] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        scrollToBottom();
    }, [messages, streamingMessage]);

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
        setIsStreaming(true);
        setStreamingMessage("");

        try {
            const response = await fetch("/api/chat-stream", {
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

            // Handle the streaming response
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullResponse = "";

            while (true) {
                const { done, value } = await reader.read();

                if (done) {
                    break;
                }

                // Decode the chunk and append it to the streaming message
                const text = decoder.decode(value, { stream: true });
                fullResponse += text;
                setStreamingMessage(fullResponse);
            }

            // When stream is complete, add the full message to the messages array
            setIsStreaming(false);
            addMessage(fullResponse, "assistant");
            setStreamingMessage("");
        } catch (error) {
            console.error("Error:", error);
            setIsStreaming(false);
            addMessage("Sorry, I encountered an error. Please try again.", "assistant");
            setStreamingMessage("");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSetLeetcodeUrl = (url) => {
        setLeetcodeUrl(url);
        addMessage(`LeetCode problem set to: ${url}`, "system");
    };

    // Combine regular messages with the currently streaming message
    const allMessages = [
        ...messages,
        ...(isStreaming && streamingMessage ? [{ content: streamingMessage, sender: "assistant", timestamp: new Date(), streaming: true }] : [])
    ];

    return (
        <Card className="w-full">
            <CardContent className="p-4">
                <div className="flex flex-col h-[80vh]">
                    <LeetcodeInput onSubmit={handleSetLeetcodeUrl} />

                    <div className="flex-1 overflow-y-auto mb-4 mt-4">
                        <MessageList messages={allMessages} />
                        <div ref={messagesEndRef} />
                    </div>

                    <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
                </div>
            </CardContent>
        </Card>
    );
}