// lib/gemini-service.js
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

export async function getGeminiStreamingResponse(prompt, messageHistory = []) {
    try {
        // Get the generative model
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: {
                temperature: 0.7,
                topP: 0.8,
                topK: 40,
            }
        });

        // If we have message history, include it in the prompt
        let fullPrompt = prompt;

        if (messageHistory.length > 0) {
            const conversationContext = messageHistory
                .filter(msg => msg.sender !== "system")
                .map(msg => `${msg.sender.toUpperCase()}: ${msg.content}`)
                .join("\n\n");

            fullPrompt = `
        Previous conversation:
        ${conversationContext}
        
        Now, respond to this: ${prompt}
      `;
        }

        // Generate content with streaming enabled
        return await model.generateContentStream(fullPrompt);
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to get streaming response from Gemini");
    }
}