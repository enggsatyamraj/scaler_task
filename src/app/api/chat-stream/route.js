// app/api/chat-stream/route.js
import { NextResponse } from "next/server";
import { getGeminiStreamingResponse } from "@/lib/gemini-service";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(request) {
    const encoder = new TextEncoder();

    try {
        // Check if user is authenticated
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        const { message, leetcodeUrl, messageHistory } = await request.json();

        // Validate input
        if (!message) {
            return NextResponse.json(
                { error: "Message is required" },
                { status: 400 }
            );
        }

        // Extract problem name from the URL if available
        let problemName = "this problem";
        if (leetcodeUrl) {
            try {
                const url = new URL(leetcodeUrl);
                const pathParts = url.pathname.split('/');
                const problemSlug = pathParts.find(part => part && part !== 'problems');

                if (problemSlug) {
                    problemName = problemSlug
                        .split('-')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ');
                }
            } catch (e) {
                console.error("Error parsing LeetCode URL:", e);
            }
        }

        // Create the system prompt
        const systemPrompt = `
    You are a specialized Data Structures and Algorithms (DSA) teaching assistant helping a student understand the LeetCode problem: "${problemName}" (${leetcodeUrl || "No URL provided yet"}).

    Your role is to guide the student through the problem-solving process WITHOUT providing direct solutions. 

    Please format your response using Markdown with the following structured approach:

    1. **Understanding the Problem:** 
       - Begin with a clear breakdown of what the problem is asking
       - Identify the inputs and expected outputs
       - Highlight key constraints or edge cases to consider
       - Use examples from the problem to illustrate the requirements

    2. **Thinking Points and Strategies:**
       - Suggest 2-3 different approaches to solve the problem (e.g., brute force, optimized solution)
       - For each approach, explain the underlying data structures and algorithms that might be useful
       - Discuss the time and space complexity considerations
       - Use bullet points and numbered lists for clarity

    3. **Hints to Guide the Student:**
       - Provide progressive hints that lead the student toward the solution
       - Ask thought-provoking questions that encourage deeper understanding
       - Suggest specific examples to trace through to build intuition
       - Explain relevant DSA concepts that connect to this problem

    4. **Next Steps:**
       - Encourage trying a specific approach first
       - Suggest how to test the solution with example cases
       - Invite the student to explain their current thinking or where they're stuck

    IMPORTANT RULES:
    - DO NOT provide complete working code solutions that solve the entire problem
    - DO use small code snippets ONLY to illustrate specific concepts, not solutions
    - Use the Socratic method - guide through questions rather than direct answers
    - Respond directly to what the student is asking while following the structure above
    - Use Markdown formatting (bold, lists, etc.) to make your response readable and organized
    - Each section of your response should be comprehensive but concise

    The student's current question is: ${message}
    `;

        // Create a stream response
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    // Get the Gemini response as a stream
                    const result = await getGeminiStreamingResponse(systemPrompt, messageHistory);

                    // Process the chunks from the Gemini response
                    for await (const chunk of result.stream) {
                        const textChunk = chunk.text();
                        if (textChunk) {
                            controller.enqueue(encoder.encode(textChunk));
                        }
                    }

                    controller.close();
                } catch (error) {
                    console.error("Stream error:", error);
                    controller.enqueue(encoder.encode("An error occurred while generating the response."));
                    controller.close();
                }
            },
        });

        // Return the stream response
        return new Response(stream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Cache-Control": "no-cache",
            },
        });
    } catch (error) {
        console.error("Error in chat stream API:", error);
        return new Response(encoder.encode("An error occurred while processing your request."), {
            status: 500,
            headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
    }
}