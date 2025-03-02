import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API with your API key
// Note: In production, use environment variables for API keys
const API_KEY = process.env.GEMINI_API_KEY || "GEMINI_API_KEY";
const genAI = new GoogleGenerativeAI(API_KEY);

export async function compareAddresses(address1, address2) {
  try {
    // For safety, check if addresses are provided
    if (!address1 || !address2) {
      throw new Error("Both addresses must be provided");
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Create a prompt for address comparison
    const prompt = `
    I need to compare two addresses to determine if they refer to the same physical location.
    
    Address 1: "${address1}"
    Address 2: "${address2}"
    
    Please analyze these addresses and provide a JSON response with the following structure:
    {
      "match": boolean, // true if they likely refer to the same place, false otherwise
      "confidence": number, // a value between 0 and 1 indicating confidence level
      "explanation": string // brief explanation of your reasoning
    }
    
    Consider variations in formatting, abbreviations, missing elements, and typos.
    Only return the JSON object, nothing else.
    `;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Extract the JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error("Failed to parse response from Gemini");
    }
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Error comparing addresses:", error);
    throw error;
  }
}
