import { Avatar } from "./ui/avatar";
import { cn } from "@/lib/utils";
import MarkdownContent from "./markdown-content";
import { BookOpen } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function MessageList({ messages }) {
    return (
        <div className="space-y-6">
            {messages.map((message, index) => (
                <div
                    key={index}
                    className={cn(
                        "flex gap-4 rounded-lg animate-in fade-in duration-200",
                        message.sender === "user" ? "flex-row" :
                            message.sender === "system" ? "flex-row bg-gray-50 dark:bg-gray-800/50 p-4 border border-gray-100 dark:border-gray-800 rounded-lg" :
                                "flex-row"
                    )}
                >
                    <div className="flex-shrink-0 mt-1">
                        {message.sender === "user" ? (
                            <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700">
                                <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                                    You
                                </span>
                            </div>
                        ) : message.sender === "system" ? (
                            <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                                    S
                                </span>
                            </div>
                        ) : (
                            <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700">
                                <BookOpen className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                            </div>
                        )}
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                {message.sender === "user" ? "You" :
                                    message.sender === "system" ? "System" : "DSA Assistant"}
                                {message.streaming &&
                                    <span className="inline-block ml-2 animate-pulse text-gray-500 dark:text-gray-400">thinking...</span>
                                }
                            </p>
                            {message.timestamp && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                                </span>
                            )}
                        </div>
                        <div className={message.sender === "assistant" ? "markdown-container prose dark:prose-invert max-w-none" : ""}>
                            {message.sender === "assistant" ? (
                                <MarkdownContent content={message.content} />
                            ) : (
                                <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">{message.content}</p>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}