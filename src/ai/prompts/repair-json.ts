export function buildRepairJsonPrompt(
  rawOutput: string,
  errorReason: string
): string {
  return `The following JSON was generated for a travel itinerary but failed validation with the following error:
"${errorReason}"

Please repair the JSON so that it is 100% valid JSON matching the schema:
- Must contain "destination", "days", "hotels", and "costSummary".
- Must contain all required day plans with slots and meals.
- Output ONLY the raw JSON object. Do not include markdown fences (\`\`\`json), comments, or conversational text.

RAW OUTPUT:
${rawOutput.slice(0, 4000)}`;
}
