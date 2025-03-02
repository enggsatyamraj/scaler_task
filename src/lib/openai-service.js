import OpenAI from 'openai';

// Initialize the OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function getChatCompletion(messages) {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o", // or "gpt-4" if you have access
            messages: messages,
            temperature: 0.7,
        });

        return completion.choices[0].message.content;
    } catch (error) {
        console.error("Error calling OpenAI API:", error);
        throw new Error("Failed to get response from AI");
    }
}