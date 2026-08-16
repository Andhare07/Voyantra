import { GoogleGenAI } from "@google/genai";
import { AppError } from "@/lib/utils/errors";

const DEFAULT_MODEL = "gemini-2.5-flash";
const DEFAULT_TIMEOUT_MS = 45000;

export class GeminiClient {
  private ai: GoogleGenAI | null = null;
  private model: string;

  constructor() {
    this.model = process.env.GEMINI_MODEL || DEFAULT_MODEL;
  }

  private getClient(): GoogleGenAI {
    if (this.ai) {
      return this.ai;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw AppError.internal(
        "GEMINI_API_KEY environment variable is missing on the server."
      );
    }

    this.ai = new GoogleGenAI({ apiKey });
    return this.ai;
  }

  /**
   * Generates itinerary text via Gemini with JSON output mode.
   */
  async generateItineraryContent(
    prompt: string,
    systemInstruction: string,
    timeoutMs: number = DEFAULT_TIMEOUT_MS
  ): Promise<string> {
    const client = this.getClient();

    const generatePromise = client.models.generateContent({
      model: this.model,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.4,
      },
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error("GEMINI_TIMEOUT")),
        timeoutMs
      )
    );

    try {
      const response = await Promise.race([generatePromise, timeoutPromise]);
      const text = response.text;

      if (!text || text.trim().length === 0) {
        throw new Error("EMPTY_GEMINI_RESPONSE");
      }

      return text;
    } catch (error) {
      if (error instanceof Error && error.message === "GEMINI_TIMEOUT") {
        console.error("[GeminiClient] Request timed out after", timeoutMs, "ms");
        throw AppError.generationFailed(
          "AI generation took longer than expected. Please try again."
        );
      }

      console.error("[GeminiClient] Generation API call failed:", error instanceof Error ? error.message : "Unknown error");
      throw AppError.generationFailed(
        "Failed to generate itinerary with AI provider."
      );
    }
  }

  /**
   * Performs a single automated repair attempt on malformed JSON.
   */
  async repairJsonContent(
    brokenJson: string,
    errorDescription: string,
    timeoutMs: number = 20000
  ): Promise<string> {
    const client = this.getClient();

    const repairPrompt = `The following JSON was generated for a travel itinerary but failed validation with error: "${errorDescription}".
Please repair the JSON so that it is 100% valid JSON matching the schema, with no markdown fences, no comments, and no truncated fields.

MALFORMED JSON:
${brokenJson.slice(0, 4000)}`;

    const generatePromise = client.models.generateContent({
      model: this.model,
      contents: repairPrompt,
      config: {
        systemInstruction:
          "You are a strict JSON repair engine. Output ONLY valid, parseable JSON conforming to the original schema. Do not include markdown codeblocks or conversational text.",
        responseMimeType: "application/json",
        temperature: 0.1,
      },
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error("REPAIR_TIMEOUT")),
        timeoutMs
      )
    );

    try {
      const response = await Promise.race([generatePromise, timeoutPromise]);
      const text = response.text;

      if (!text || text.trim().length === 0) {
        throw new Error("EMPTY_REPAIR_RESPONSE");
      }

      return text;
    } catch (err) {
      console.error("[GeminiClient] JSON repair attempt failed:", err instanceof Error ? err.message : "Unknown error");
      throw AppError.generationFailed(
        "Failed to parse and repair AI itinerary structure."
      );
    }
  }
}

export const geminiClient = new GeminiClient();
