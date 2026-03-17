import type { CandidateSpot, SunTimes, TripPlan, TripRequest } from "./types";

function describeType(type: string) {
  switch (type) {
    case "cafe":
      return "ruhige Szenen, Details und Alltagsmomente";
    case "viewpoint":
      return "weite Perspektiven und Layering im Bild";
    case "waterfront":
      return "Reflexionen, offene Linien und Licht am Wasser";
    case "architecture":
      return "saubere Geometrie, Fassaden und Symmetrie";
    case "street":
      return "Bewegung, Gesten und urbane Zwischentoene";
    case "park":
      return "ruhigere Kontraste zwischen Natur und Stadt";
    default:
      return "eine vielseitige fotografische Szene";
  }
}

function buildIdeas(spot: CandidateSpot, request: TripRequest): string[] {
  const primaryStyle = request.styles[0];

  const ideas = [
    `Arbeite mit ${describeType(spot.type)} und einer klaren Vordergrundebene.`,
    request.vibe
      ? `Halte die Bildstimmung ${request.vibe} ueber Licht, Abstand und Farbkontraste konsistent.`
      : "Suche nach einer klaren Bildidee mit Linien, Bewegung oder Textur."
  ];

  if (primaryStyle === "architecture") {
    ideas[0] = "Suche nach Symmetrie, negativen Flaechen und fuehrenden Linien.";
  }

  if (primaryStyle === "street") {
    ideas[0] = "Warte auf einzelne Personen oder Bewegung, um die Szene zu verdichten.";
  }

  if (request.styles.includes("sunset")) {
    ideas[1] = "Nutze warmes Seitenlicht fuer Silhouetten, Reflexionen oder weiche Kontraste.";
  }

  return ideas;
}

function buildReason(spot: CandidateSpot, request: TripRequest) {
  const styleText = request.styles.join(", ");
  return `${spot.name} passt zu ${styleText}, weil der Spot ${describeType(spot.type)} bietet.`;
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
      ? `nahe ${sunTimes.sunset}`
      : window?.bestTime || "wenn das Licht seitlich oder etwas weicher wird";

    return {
      ...spot,
      rank: index + 1,
      bestTime,
      timeWindow: window?.timeWindow || `Stop ${index + 1}`,
      reason: buildReason(spot, request),
      description: `${spot.name} eignet sich gut fuer ${describeType(spot.type)} und bleibt im Rahmen eines ${request.pace}en Tagesplans fotografisch vielseitig.`,
      photoIdeas: buildIdeas(spot, request)
    };
  });

  return {
    title: `${request.city}: fotografischer Tagesplan`,
    summary: `Ein kompakter Plan mit ${spots.length} Spots, passend zu ${request.styles.join(", ")} und einem ${request.pace}en Rhythmus.`,
    routePolyline: spots.map((spot) => ({ lat: spot.lat, lon: spot.lon })),
    notes: [
      `Sonnenaufgang: ${sunTimes.sunrise}`,
      `Sonnenuntergang: ${sunTimes.sunset}`,
      "Die Reihenfolge basiert im MVP auf einer Distanz-Heuristik, nicht auf echter Strassennavigation.",
      "Ollama war nicht erreichbar oder hat kein valides JSON geliefert, deshalb wurde ein Fallback verwendet."
    ],
    generatedWith: "fallback",
    spots
  };
}
