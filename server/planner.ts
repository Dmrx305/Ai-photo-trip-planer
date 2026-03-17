import { z } from "zod";
import { buildFallbackPlan } from "./fallback";
import { selectBestSpots, orderSpotsByDistance } from "./scoring";
import { assignTimeWindows } from "./time";
import { geocodeCity } from "./services/geocoding";
import { enrichPlanWithOllama } from "./services/ollama";
import { fetchSpotCandidates } from "./services/overpass";
import { fetchSunTimes } from "./services/sun";
import type { TripPlan, TripRequest } from "./types";

const requestSchema = z.object({
  city: z.string().trim().min(2),
  duration: z.enum(["half-day", "full-day"]),
  styles: z
    .array(z.enum(["street", "nature", "architecture", "sunset", "hidden-gems"]))
    .min(1),
  pace: z.enum(["relaxed", "balanced", "packed"]),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  transport: z.enum(["walk", "bike", "car", "public-transport"]),
  budget: z.number().nullable(),
  vibe: z.string()
});

export async function createTripPlan(input: unknown): Promise<TripPlan> {
  const request = requestSchema.parse(input) as TripRequest;
  const location = await geocodeCity(request.city);
  const [candidateSpots, sunTimes] = await Promise.all([
    fetchSpotCandidates(location.lat, location.lon, request.styles),
    fetchSunTimes(location.lat, location.lon)
  ]);

  if (candidateSpots.length < 3) {
    throw new Error("Zu wenige geeignete Spots gefunden. Versuche eine groessere Stadt oder weniger spezifische Filter.");
  }

  const selectedSpots = selectBestSpots(location, candidateSpots, request.styles, request.pace);
  const orderedSpots = orderSpotsByDistance(location, selectedSpots);
  const windows = assignTimeWindows(orderedSpots, request.startTime, request.duration, sunTimes);
  const fallbackPlan = buildFallbackPlan(request, orderedSpots, sunTimes, windows);

  try {
    const aiPlan = await enrichPlanWithOllama(request, orderedSpots, sunTimes);

    if (!aiPlan || aiPlan.spots.length !== orderedSpots.length) {
      return fallbackPlan;
    }

    const enrichedSpots = orderedSpots.map((spot, index) => {
      const aiSpot = aiPlan.spots.find((entry) => entry.id === spot.id) ?? aiPlan.spots[index];
      const window = windows[index];

      return {
        ...spot,
        rank: index + 1,
        bestTime: aiSpot?.bestTime || window.bestTime,
        timeWindow: aiSpot?.timeWindow || window.timeWindow,
        reason: aiSpot?.reason || fallbackPlan.spots[index].reason,
        description: aiSpot?.description || fallbackPlan.spots[index].description,
        photoIdeas:
          aiSpot?.photoIdeas?.length
            ? aiSpot.photoIdeas.slice(0, 2)
            : fallbackPlan.spots[index].photoIdeas
      };
    });

    return {
      title: aiPlan.title || fallbackPlan.title,
      summary: aiPlan.summary || fallbackPlan.summary,
      routePolyline: enrichedSpots.map((spot) => ({ lat: spot.lat, lon: spot.lon })),
      notes: [
        `Sonnenaufgang: ${sunTimes.sunrise}`,
        `Sonnenuntergang: ${sunTimes.sunset}`,
        "Die Reihenfolge basiert im MVP auf einer Distanz-Heuristik, nicht auf echter Strassennavigation.",
        ...(aiPlan.notes ?? [])
      ],
      generatedWith: "ollama",
      spots: enrichedSpots
    };
  } catch {
    return fallbackPlan;
  }
}
