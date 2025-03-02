import { NextResponse } from "next/server";
import { getGeminiResponse } from "@/lib/gemini-service";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// app/api/chat/route.js
export async function POST(request) {
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

        // Create a more detailed system prompt for Gemini
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

        // Get response from Gemini
        const response = await getGeminiResponse(systemPrompt, messageHistory);

        return NextResponse.json({ response });
    } catch (error) {
        console.error("Error processing chat request:", error);
        return NextResponse.json(
            { error: "Failed to process request" },
            { status: 500 }
        );
    }
}