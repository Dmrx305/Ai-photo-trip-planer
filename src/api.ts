import type { TripPlan, TripRequest } from "./types";

export async function createTripPlan(input: TripRequest): Promise<TripPlan> {
  const response = await fetch("/api/plan-trip", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Trip planning failed.");
  }

  return response.json() as Promise<TripPlan>;
}
