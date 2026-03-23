import type { GeocodedPlace } from "../types";

export async function geocodeCity(city: string): Promise<GeocodedPlace> {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", city);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("limit", "1");

  const response = await fetch(url, {
    headers: {
      "User-Agent": "AI Photo Trip Planner MVP"
    }
  });

  if (!response.ok) {
    throw new Error("Geocoding failed.");
  }

  const data = (await response.json()) as Array<{
    display_name: string;
    lat: string;
    lon: string;
    boundingbox?: [string, string, string, string];
  }>;

  if (!data[0]) {
    throw new Error("No location could be found for that input.");
  }

  const item = data[0];
  return {
    displayName: item.display_name,
    lat: Number(item.lat),
    lon: Number(item.lon),
    boundingBox: item.boundingbox
      ? [
          Number(item.boundingbox[0]),
          Number(item.boundingbox[1]),
          Number(item.boundingbox[2]),
          Number(item.boundingbox[3])
        ]
      : undefined
  };
}
