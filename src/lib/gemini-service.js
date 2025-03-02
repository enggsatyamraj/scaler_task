import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

export async function getGeminiResponse(prompt, messageHistory = []) {
    try {
        // Get the generative model with the correct model name
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Check if we have message history
        if (messageHistory.length > 0) {
            // Filter out system messages and ensure proper formatting
            const formattedHistory = messageHistory
                .filter(msg => msg.sender !== "system")
                .map(msg => ({
                    role: msg.sender === "user" ? "user" : "model",
                    parts: [{ text: msg.content }]
                }));

            // Ensure the first message is from the user
            if (formattedHistory.length > 0 && formattedHistory[0].role === "user") {
                // Start a chat session with history
                const chat = model.startChat({
                    history: formattedHistory,
                    generationConfig: {
                        temperature: 0.7,
                        topP: 0.8,
                        topK: 40,
                    },
                });

                // Generate a response
                const result = await chat.sendMessage(prompt);
                return result.response.text();
            }
        }

        // If we don't have valid history, just send a single message
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to get response from Gemini");
    }
}