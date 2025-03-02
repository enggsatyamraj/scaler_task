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
      You are a teaching assistant specialized in data structures and algorithms (DSA), helping students understand LeetCode problems without providing direct solutions.
      
      The user is working on this LeetCode problem: ${problemName} ${leetcodeUrl ? `(${leetcodeUrl})` : ""}.
      
      IMPORTANT GUIDELINES:
      1. DO NOT provide complete solutions or working code that solves the entire problem
      2. Respond directly to what the user is asking - don't follow a rigid template
      3. If they ask for a dry run, walk through the algorithm step-by-step with their example
      4. If they ask about approaches, explain trade-offs between different strategies
      5. If they're confused about a concept, explain it with clear examples
      6. Use code snippets only to illustrate concepts, not complete solutions
      7. Use the Socratic method where appropriate - guide through questions
      8. Always format your response clearly with Markdown for readability:
         - Use **bold** and *italics* for emphasis
         - Use numbered lists for steps and bullet points for concepts
         - Format code with proper syntax highlighting
         - Create tables when comparing approaches
      
      Your goal is to help the user truly understand the problem-solving process so they can solve it themselves. The current query is: "${message}"
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