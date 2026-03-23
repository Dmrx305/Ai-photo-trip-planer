import type { CandidateSpot, SunTimes, TripPlan, TripRequest } from "./types";

function describeType(type: string) {
  switch (type) {
    case "cafe":
      return "quiet scenes, details, and everyday moments";
    case "viewpoint":
      return "wide perspectives and layered compositions";
    case "waterfront":
      return "reflections, open lines, and light near the water";
    case "architecture":
      return "clean geometry, facades, and symmetry";
    case "street":
      return "movement, gestures, and urban in-between moments";
    case "park":
      return "quieter contrasts between nature and the city";
    default:
      return "a versatile photographic scene";
  }
}

function buildIdeas(spot: CandidateSpot, request: TripRequest): string[] {
  const primaryStyle = request.styles[0];

  const ideas = [
    `Work with ${describeType(spot.type)} and a clear foreground layer.`,
    request.vibe
      ? `Keep the ${request.vibe} mood consistent through light, spacing, and color contrast.`
      : "Look for a clear visual idea built around lines, movement, or texture."
  ];

  if (primaryStyle === "architecture") {
    ideas[0] = "Look for symmetry, negative space, and leading lines.";
  }

  if (primaryStyle === "street") {
    ideas[0] = "Wait for isolated people or motion to tighten the composition.";
  }

  if (request.styles.includes("sunset")) {
    ideas[1] = "Use warm side light for silhouettes, reflections, or softer contrast.";
  }

  return ideas;
}

function buildReason(spot: CandidateSpot, request: TripRequest) {
  const styleText = request.styles.join(", ");
  return `${spot.name} fits ${styleText} because the location offers ${describeType(spot.type)}.`;
}

export function buildFallbackPlan(
  request: TripRequest,
  orderedSpots: CandidateSpot[],
  sunTimes: SunTimes,
  timeWindows: Array<{ id: string; bestTime: string; timeWindow: string }>
): TripPlan {
  const spots = orderedSpots.map((spot, index) => {
    const window = timeWindows[index];
    const isSunsetSlot =
      request.styles.includes("sunset") && index === orderedSpots.length - 1;

    const bestTime = isSunsetSlot
      ? `around ${sunTimes.sunset}`
      : window?.bestTime || "when the light turns softer or more directional";

    return {
      ...spot,
      rank: index + 1,
      bestTime,
      timeWindow: window?.timeWindow || `Stop ${index + 1}`,
      reason: buildReason(spot, request),
      description: `${spot.name} works well for ${describeType(spot.type)} and stays visually useful within a ${request.pace} day plan.`,
      photoIdeas: buildIdeas(spot, request)
    };
  });

  return {
    title: `${request.city}: photo day plan`,
    summary: `A compact route with ${spots.length} stops, shaped around ${request.styles.join(", ")} and a ${request.pace} pace.`,
    routePolyline: spots.map((spot) => ({ lat: spot.lat, lon: spot.lon })),
    notes: [
      `Sunrise: ${sunTimes.sunrise}`,
      `Sunset: ${sunTimes.sunset}`,
      "In the MVP, route order is based on a distance heuristic rather than real road navigation.",
      "Ollama was unavailable or returned invalid JSON, so the fallback planner was used."
    ],
    generatedWith: "fallback",
    spots
  };
}
