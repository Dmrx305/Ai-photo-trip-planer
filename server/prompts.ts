import type { CandidateSpot, SunTimes, TripRequest } from "./types";

export function buildPlannerPrompt(
  request: TripRequest,
  orderedSpots: CandidateSpot[],
  sunTimes: SunTimes
) {
  const spotLines = orderedSpots
    .map(
      (spot, index) =>
        `${index + 1}. ${spot.name} | type=${spot.type} | tags=${spot.tags.join(", ")} | lat=${spot.lat} | lon=${spot.lon}`
    )
    .join("\n");

  return `
You are a photography trip planner. Return only valid JSON.

User request:
- city: ${request.city}
- duration: ${request.duration}
- styles: ${request.styles.join(", ")}
- pace: ${request.pace}
- startTime: ${request.startTime}
- transport: ${request.transport}
- budget: ${request.budget ?? "unknown"}
- vibe: ${request.vibe || "not specified"}

Sun times:
- sunrise: ${sunTimes.sunrise}
- sunset: ${sunTimes.sunset}

Ordered candidate spots:
${spotLines}

Return JSON with this exact shape:
{
  "title": "string",
  "summary": "string",
  "notes": ["string"],
  "spots": [
    {
      "id": "string",
      "bestTime": "string",
      "timeWindow": "string",
      "reason": "string",
      "description": "string",
      "photoIdeas": ["string", "string"]
    }
  ]
}

Rules:
- Keep the existing spot order.
- Use all provided spots.
- Tailor the descriptions to the requested vibe and styles.
- Be concise and practical.
- Mention photography cues like reflections, layers, silhouettes, geometry, movement, framing, or texture when relevant.
- If the user wants a relaxed plan, keep the tone calm and low pressure.
- Output only JSON and no markdown.
`.trim();
}
