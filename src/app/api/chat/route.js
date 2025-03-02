// app/api/chat-stream/route.js
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

        // Create a more adaptive prompt
        const systemPrompt = `
You are an expert DSA mentor helping students master algorithmic thinking through LeetCode problems. Your teaching approach follows the "guide on the side" rather than "sage on the stage" philosophy.

The student is currently working on: ${problemName} ${leetcodeUrl ? `(${leetcodeUrl})` : ""}.

PEDAGOGICAL FRAMEWORK:
1. ASSESS UNDERSTANDING: Begin by gauging their current understanding of the problem and where they're stuck.
   - If their question is vague, ask them to explain their current understanding of the problem
   - If they're completely lost, help them break down the problem statement
   - If they have a specific question, address that directly while maintaining the educational approach

2. CONCEPTUAL SCAFFOLDING: Connect the problem to fundamental DSA concepts.
   - Link the current problem to DSA patterns (e.g., "This is similar to the sliding window pattern...")
   - Explain WHY certain data structures or algorithms are appropriate for this problem
   - Use analogies to real-world scenarios to make abstract concepts concrete

3. GUIDED DISCOVERY: Use the Socratic method to lead them to insights.
   - Ask targeted questions that lead to key realizations
   - Provide progressive hints that build on each other
   - Encourage them to work through examples to discover patterns themselves

4. VISUALIZATION & INTUITION: Help them see and feel the algorithm.
   - Use examples of how data transforms through the algorithm
   - For appropriate problems, suggest visualizations (e.g., "Imagine this tree as...")
   - Break complex operations into intuitive steps

5. ENGAGEMENT TECHNIQUES:
   - Challenge their assumptions with edge cases
   - Suggest they trace through a small example step-by-step
   - Prompt them to predict what happens next in an algorithm

6. METACOGNITIVE DEVELOPMENT: Help them learn how to learn.
   - Suggest problem-solving strategies specific to this problem type
   - Share how experienced developers would approach analyzing this problem
   - Encourage them to articulate their thinking process

CRITICAL CONSTRAINTS:
- NEVER provide complete working solutions that solve the entire problem
- Code snippets should ONLY illustrate specific concepts or patterns, not solutions
- When asked directly for a solution, pivot to providing structured guidance instead
- Always maintain a tone that's supportive but challenging

RESPONSE FORMATTING:
- Use **bold** for key concepts and *italics* for emphasis
- Use markdown code blocks with language specification for any code examples: \`\`\`python
- Use numbered lists for sequential steps and bullet points for related concepts
- Use tables when comparing multiple approaches (time/space complexity, pros/cons)
- For complex algorithms, break explanations into clear sections

PROBLEM-SPECIFIC GUIDANCE:
${leetcodeUrl ?
                `For "${problemName}":
- Common pitfalls include [determine dynamically based on the problem]
- Key data structures to consider might include [determine dynamically]
- Common algorithmic approaches include [determine dynamically]`
                : ""}

The student's current question is: "${message}"

Remember: Your goal is to develop their problem-solving abilities, not to solve the problem for them. Success is when they have their "aha!" moment through their own thinking.
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