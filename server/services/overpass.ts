import type { CandidateSpot, PhotoStyle } from "../types";

const styleToFilters: Record<PhotoStyle, string[]> = {
  street: [
    'node["amenity"="cafe"]',
    'way["amenity"="cafe"]',
    'node["place"="square"]',
    'way["place"="square"]',
    'node["amenity"="marketplace"]',
    'way["amenity"="marketplace"]',
    'node["tourism"="attraction"]',
    'way["tourism"="attraction"]'
  ],
  nature: [
    'node["tourism"="viewpoint"]',
    'way["leisure"="park"]',
    'node["natural"="peak"]',
    'way["natural"="water"]'
  ],
  architecture: [
    'way["building"]["name"]',
    'node["historic"]',
    'way["historic"]',
    'node["tourism"="museum"]',
    'way["tourism"="museum"]'
  ],
  sunset: [
    'node["tourism"="viewpoint"]',
    'way["natural"="water"]',
    'way["man_made"="pier"]',
    'way["bridge"]'
  ],
  "hidden-gems": [
    'node["historic"]',
    'way["historic"]',
    'node["tourism"="gallery"]',
    'way["tourism"="gallery"]',
    'node["memorial"]'
  ]
};

function inferSpotType(tags: Record<string, string>) {
  if (tags.amenity === "cafe") return "cafe";
  if (tags.place === "square" || tags.amenity === "marketplace") return "street";
  if (tags.tourism === "viewpoint") return "viewpoint";
  if (tags.leisure === "park") return "park";
  if (tags.building) return "architecture";
  if (tags.natural === "water" || tags.waterway) return "waterfront";
  if (tags.highway === "pedestrian") return "street";
  if (tags.bridge) return "bridge";
  if (tags.historic || tags.memorial) return "historic";
  return "spot";
}

function buildTags(type: string, tags: Record<string, string>) {
  const values = new Set<string>([type]);
  const relevantKeys = [
    "amenity",
    "tourism",
    "leisure",
    "historic",
    "building",
    "natural",
    "waterway",
    "place",
    "bridge",
    "memorial"
  ] as const;

  for (const key of relevantKeys) {
    const value = tags[key];
    if (value) {
      values.add(value.toLowerCase());
    }
  }

  return [...values];
}

export async function fetchSpotCandidates(
  lat: number,
  lon: number,
  styles: PhotoStyle[]
): Promise<CandidateSpot[]> {
  const filters = [...new Set(styles.flatMap((style) => styleToFilters[style]))];
  const radii = styles.includes("nature") ? [7000, 5000, 3200] : [5500, 3800, 2400];

  for (const radius of radii) {
    try {
      const queryLines = filters.map((filter) => `${filter}(around:${radius},${lat},${lon});`);
      const query = `
[out:json][timeout:25];
(
${queryLines.join("\n")}
);
out center tags;
`.trim();

      const response = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        headers: {
          "Content-Type": "text/plain"
        },
        body: query
      });

      if (!response.ok) {
        continue;
      }

      const data = (await response.json()) as {
        elements: Array<{
          id: number;
          lat?: number;
          lon?: number;
          center?: { lat: number; lon: number };
          tags?: Record<string, string>;
        }>;
      };

      const candidates = data.elements
        .map((element) => {
          const tags = element.tags ?? {};
          const type = inferSpotType(tags);
          const point = element.center ?? (element.lat && element.lon ? { lat: element.lat, lon: element.lon } : null);
          const name = tags.name || tags["name:en"] || tags["alt_name"];

          if (!point || !name) {
            return null;
          }

          return {
            id: `${element.id}`,
            name,
            type,
            lat: point.lat,
            lon: point.lon,
            tags: buildTags(type, tags),
            score: 1
          };
        })
        .filter((entry): entry is CandidateSpot => Boolean(entry));

      const seen = new Set<string>();
      const uniqueCandidates = candidates.filter((candidate) => {
        const key = `${candidate.name}:${candidate.lat.toFixed(4)}:${candidate.lon.toFixed(4)}`;
        if (seen.has(key)) {
          return false;
        }
        seen.add(key);
        return true;
      });

      if (uniqueCandidates.length > 0) {
        return uniqueCandidates;
      }
    } catch {
      continue;
    }
  }

  throw new Error("Spotsuche ueber Overpass fehlgeschlagen.");
}
