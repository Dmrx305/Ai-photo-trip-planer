import type { CandidateSpot, TripPlan, TripRequest, SunTimes } from "../types";
import { buildPlannerPrompt } from "../prompts";

type OllamaResponse = {
  response?: string;
};

export async function enrichPlanWithOllama(
  request: TripRequest,
  orderedSpots: CandidateSpot[],
  sunTimes: SunTimes
): Promise<{
  title: string;
  summary: string;
  notes: string[];
  spots: Array<{
    id: string;
    bestTime: string;
    timeWindow: string;
    reason: string;
    description: string;
    photoIdeas: string[];
  }>;
} | null> {
  const baseUrl = process.env.OLLAMA_BASE_URL ?? "http://127.0.0.1:11434";
  const model = process.env.OLLAMA_MODEL ?? "llama3.1:8b";
  const prompt = buildPlannerPrompt(request, orderedSpots, sunTimes);

  const response = await fetch(`${baseUrl}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      prompt,
      stream: false,
      format: "json"
    })
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as OllamaResponse;
  if (!data.response) {
    return null;
  }

  try {
    const parsed = JSON.parse(data.response) as TripPlan;
    if (!parsed.spots || !Array.isArray(parsed.spots)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}
