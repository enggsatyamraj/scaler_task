export function generateLLMPrompt(message, leetcodeUrl, messageHistory) {
  // Extract the problem name from the URL if available
  const problemName = leetcodeUrl
    ? extractProblemNameFromUrl(leetcodeUrl)
    : "the problem";

  // Create a system prompt that instructs the LLM on how to behave
  const systemPrompt = `
    You are a teaching assistant specialized in data structures and algorithms (DSA).
    Your role is to help users understand LeetCode problems without providing direct solutions.
    
    The user is working on the following LeetCode problem: ${problemName} (${leetcodeUrl || "No URL provided yet"})
    
    Guidelines:
    1. DO NOT provide complete solutions or working code that solves the entire problem.
    2. DO provide hints, explanations of concepts, and guidance on problem-solving approaches.
    3. Ask clarifying questions to better understand the user's confusion.
    4. Use the Socratic method - guide through questions rather than direct answers.
    5. Provide small code snippets only to illustrate concepts, not solutions.
    6. Encourage the user to think about edge cases and test their solutions.
    7. If the user seems particularly stuck, provide progressively more detailed hints.
    
    Remember, your goal is to help the user learn and solve the problem themselves, not to solve it for them.
  `;

  // Format conversation history for context
  const conversationContext = messageHistory
    .filter(m => m.sender !== "system")
    .map(m => `${m.sender.toUpperCase()}: ${m.content}`)
    .join("\n\n");

  // Combine all components into a final prompt
  return `
    ${systemPrompt}
    
    CONVERSATION HISTORY:
    ${conversationContext || "No prior messages"}
    
    USER'S CURRENT QUESTION:
    ${message}
    
    Your response (remember to guide rather than solve):
  `;
}

// Helper function to extract problem name from LeetCode URL
function extractProblemNameFromUrl(url) {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    const problemSlug = pathParts.find(part => part && part !== 'problems');

    if (problemSlug) {
      // Convert slug to readable format (e.g., "two-sum" to "Two Sum")
      return problemSlug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }

    return "the LeetCode problem";
  } catch (error) {
    console.error("Error extracting problem name:", error);
    return "the LeetCode problem";
  }
}