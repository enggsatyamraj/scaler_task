import { Avatar } from "./ui/avatar";
import { cn } from "@/lib/utils";
import MarkdownContent from "./markdown-content";

export default function MessageList({ messages }) {
    if (messages.length === 0) {
        return (
            <div className="text-center text-muted-foreground p-8">
                <p>No messages yet. Set a LeetCode problem and start asking questions!</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {messages.map((message, index) => (
                <div
                    key={index}
                    className={cn(
                        "flex items-start gap-4 p-6 rounded-lg",
                        message.sender === "user" ? "bg-primary/10" :
                            message.sender === "system" ? "bg-muted" : "bg-secondary/10"
                    )}
                >
                    <Avatar className="h-10 w-10 mt-1">
                        {message.sender === "user" ? "U" :
                            message.sender === "system" ? "S" : "AI"}
                    </Avatar>
                    <div className="flex-1">
                        <p className="text-sm font-medium mb-2">
                            {message.sender === "user" ? "You" :
                                message.sender === "system" ? "System" : "DSA Assistant"}
                            {message.streaming &&
                                <span className="inline-block ml-2 animate-pulse">...</span>
                            }
                        </p>
                        <div className={message.sender === "assistant" ? "markdown-container" : ""}>
                            {message.sender === "assistant" ? (
                                <MarkdownContent content={message.content} />
                            ) : (
                                <p className="whitespace-pre-wrap">{message.content}</p>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}