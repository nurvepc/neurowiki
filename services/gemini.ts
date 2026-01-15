
import { GoogleGenAI } from "@google/genai";
import { WikiEntry, Reference } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are NeuroWiki, a world-class neurological medical encyclopedia.
Your goal is to provide highly accurate, professional, and detailed medical information for Neurologists.
Structure your responses like a medical textbook or Wikipedia article.
Tone: Clinical, objective, professional, concise but thorough.
Use your internal medical knowledge base to generate the content. Do NOT use external search engines.
`;

export const generateWikiEntry = async (topic: string): Promise<WikiEntry> => {
  try {
    const model = 'gemini-3-pro-preview'; 
    
    const prompt = `
      Create a comprehensive medical encyclopedia entry for the neurological topic: "${topic}".
      
      Structure the response in strict Markdown format with the following sections (use H2 ## for headers):
      1. Clinical Overview (Definition & Epidemiology)
      2. Pathophysiology / Etiology
      3. Clinical Presentation (Signs & Symptoms)
      4. Diagnostic Workup (Imaging, Labs, Criteria)
      5. Management & Treatment (Pharmacology, Interventions)
      6. Prognosis
      
      Generate the content based on your internal knowledge catalogue.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        thinkingConfig: { thinkingBudget: 2048 },
      },
    });

    const text = response.text || "No content generated.";
    
    // No external search, so no references are fetched.
    // We return an empty array or could instruct the model to cite landmark trials in text.
    const references: Reference[] = [];

    return {
      topic,
      summary: "AI Generated Entry",
      sections: [{ title: "Full Article", content: text }],
      references
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate neurological content. Please try again.");
  }
};

export const suggestTopics = async (query: string): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `List 5 relevant neurological topic titles related to "${query}". Return ONLY the titles as a JSON array of strings. Example: ["Multiple Sclerosis", "Optic Neuritis"]`,
      config: {
        responseMimeType: "application/json"
      }
    });
    
    const json = JSON.parse(response.text || "[]");
    return Array.isArray(json) ? json : [];
  } catch (e) {
    return [];
  }
}

export const askQuickAnswer = async (query: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a concise, clinical summary answering the query: "${query}". Focus on diagnostic criteria, key management steps, or evidence-based pearls appropriate for a neurologist. Keep it under 300 words.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });
    return response.text || "No response generated.";
  } catch (e) {
    console.error("AI Quick Answer Error:", e);
    return "Unable to generate AI response.";
  }
}
