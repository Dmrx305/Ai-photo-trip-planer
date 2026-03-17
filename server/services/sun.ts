import type { SunTimes } from "../types";

function toLocalTime(value: string) {
  const date = new Date(value);
  return date.toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
}

export async function fetchSunTimes(lat: number, lon: number): Promise<SunTimes> {
  const url = new URL("https://api.sunrise-sunset.org/json");
  url.searchParams.set("lat", `${lat}`);
  url.searchParams.set("lng", `${lon}`);
  url.searchParams.set("formatted", "0");

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Sonnenzeiten konnten nicht geladen werden.");
  }

  const data = (await response.json()) as {
    results: {
      sunrise: string;
      sunset: string;
    };
  };

  return {
    sunrise: toLocalTime(data.results.sunrise),
    sunset: toLocalTime(data.results.sunset)
  };
}
