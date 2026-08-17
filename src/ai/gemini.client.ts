import { GoogleGenAI } from "@google/genai";
import { AppError } from "@/lib/utils/errors";

const DEFAULT_MODEL = "gemini-3.5-flash";
const DEFAULT_TIMEOUT_MS = 45000;

function formatGeminiError(error: unknown, model: string): string {
  if (!error) {
    return `AI generation failed on model '${model}'.`;
  }

  let rawMessage = error instanceof Error ? error.message : String(error);

  // Redact potential API keys or sensitive query tokens
  rawMessage = rawMessage.replace(/key=[^&\s"']+/gi, "key=[REDACTED]");
  rawMessage = rawMessage.replace(/AIza[a-zA-Z0-9_-]{35}/g, "[REDACTED_API_KEY]");

  // Attempt to parse nested Google ApiError JSON if present
  try {
    const jsonStart = rawMessage.indexOf("{");
    const jsonEnd = rawMessage.lastIndexOf("}");
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      const parsed = JSON.parse(rawMessage.slice(jsonStart, jsonEnd + 1)) as {
        error?: {
          code?: number;
          message?: string;
          status?: string;
          details?: Array<{ reason?: string; message?: string }>;
        };
      };

      if (parsed?.error) {
        const { code, message, status } = parsed.error;
        const cleanMsg = (message || "Provider error").replace(
          /key=[^&\s"']+/gi,
          "key=[REDACTED]"
        );
        const parts = [
          code ? `[HTTP ${code}]` : null,
          status ? `(${status})` : null,
          cleanMsg,
        ].filter(Boolean);

        return `Gemini API error (${model}): ${parts.join(" ")}`;
      }
    }
  } catch {
    // Fall back to direct error properties
  }

  // Handle ApiError status if available
  if (typeof error === "object" && error !== null && "status" in error) {
    const status = (error as { status?: number | string }).status;
    return `Gemini API error (${model}) [Status ${status}]: ${rawMessage}`;
  }

  return `Gemini API error (${model}): ${rawMessage}`;
}

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

      const formattedError = formatGeminiError(error, this.model);
      console.error("[GeminiClient] Generation API call failed:", formattedError);
      throw AppError.generationFailed(formattedError);
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
      const formattedError = formatGeminiError(err, this.model);
      console.error("[GeminiClient] JSON repair attempt failed:", formattedError);
      throw AppError.generationFailed(
        `Failed to parse and repair AI itinerary structure (${formattedError})`
      );
    }
  }
}

export const geminiClient = new GeminiClient();
