"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import MessageList from "./message-list";
import MessageInput from "./message-input";
import LeetcodeInput from "./leetcode-input";
import { Card, CardContent } from "./ui/card";
import { BookOpen, Code2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
        <div className="flex flex-col h-[calc(100vh-80px)]">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
                <div className="lg:col-span-1">
                    <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-4">
                                <Code2 className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Active Problem</h2>
                            </div>
                            <LeetcodeInput onSubmit={handleSetLeetcodeUrl} />

                            {leetcodeUrl && (
                                <div className="mt-4">
                                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Current problem:</div>
                                    <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 break-all">
                                        {leetcodeUrl}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-3">
                    <Card className={cn(
                        "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 transition-all duration-300",
                        isStreaming ? "shadow-md border-gray-300 dark:border-gray-700" : ""
                    )}>
                        <CardContent className="p-0">
                            <div className="flex flex-col h-[calc(100vh-160px)]">
                                {isStreaming && (
                                    <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 text-gray-700 dark:text-gray-300 animate-spin" />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">Generating response...</span>
                                    </div>
                                )}

                                <div className="flex-1 overflow-y-auto p-4">
                                    {allMessages.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center text-center p-6">
                                            <BookOpen className="h-16 w-16 text-gray-300 dark:text-gray-700 mb-4" />
                                            <h3 className="text-xl font-medium text-gray-600 dark:text-gray-400 mb-2">Your DSA Assistant is Ready</h3>
                                            <p className="text-gray-500 dark:text-gray-500 max-w-md">
                                                Set a LeetCode problem URL and start asking questions about algorithms, approaches, or specific concepts.
                                            </p>
                                        </div>
                                    ) : (
                                        <MessageList messages={allMessages} />
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                <div className="border-t border-gray-200 dark:border-gray-800 p-4">
                                    <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}