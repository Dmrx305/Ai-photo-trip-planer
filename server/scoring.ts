import type { CandidateSpot, GeocodedPlace, PhotoStyle, TripPace } from "./types";

const styleBoosts: Record<PhotoStyle, string[]> = {
  street: ["street", "cafe", "square", "pedestrian", "market", "waterfront"],
  nature: ["park", "garden", "forest", "viewpoint", "waterfront"],
  architecture: ["architecture", "bridge", "museum", "historic", "monument"],
  sunset: ["viewpoint", "waterfront", "bridge", "park"],
  "hidden-gems": ["historic", "gallery", "alley", "memorial", "courtyard"]
};

const paceSpotCounts: Record<TripPace, number> = {
  relaxed: 3,
  balanced: 4,
  packed: 5
};

const minimumSpacingKm: Record<TripPace, number> = {
  relaxed: 0.9,
  balanced: 0.55,
  packed: 0.3
};

const typeBaseScore: Record<string, number> = {
  cafe: 4,
  viewpoint: 4,
  architecture: 4,
  historic: 4,
  waterfront: 3,
  park: 3,
  street: 2,
  bridge: 1,
  spot: 0
};

function distanceInKm(aLat: number, aLon: number, bLat: number, bLon: number) {
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const earthRadius = 6371;
  const dLat = toRadians(bLat - aLat);
  const dLon = toRadians(bLon - aLon);
  const aa =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(aLat)) *
      Math.cos(toRadians(bLat)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa));
  return earthRadius * c;
}

export function selectBestSpots(
  center: GeocodedPlace,
  spots: CandidateSpot[],
  styles: PhotoStyle[],
  pace: TripPace
) {
  const scored = spots.map((spot) => {
    let score = spot.score + (typeBaseScore[spot.type] ?? 0);

    for (const style of styles) {
      const boosts = styleBoosts[style];
      if (boosts.some((entry) => spot.tags.includes(entry) || spot.type.includes(entry))) {
        score += 4;
      }
    }

    const distance = distanceInKm(center.lat, center.lon, spot.lat, spot.lon);
    score += Math.max(0, 3 - distance);

    return {
      ...spot,
      score
    };
  });

  const sorted = scored.sort((left, right) => right.score - left.score);
  const maxCount = paceSpotCounts[pace];
  const spacingAttempts = [
    minimumSpacingKm[pace],
    minimumSpacingKm[pace] * 0.6,
    0
  ];

  for (const minSpacing of spacingAttempts) {
    const selected: CandidateSpot[] = [];

    for (const spot of sorted) {
      const sameTypeCount = selected.filter((entry) => entry.type === spot.type).length;
      const isTooClose = selected.some((entry) => {
        const distance = distanceInKm(entry.lat, entry.lon, spot.lat, spot.lon);
        return distance < minSpacing;
      });

      if (sameTypeCount >= 2) {
        continue;
      }

      if (isTooClose) {
        continue;
      }

      selected.push(spot);

      if (selected.length === maxCount) {
        return selected;
      }
    }

    if (selected.length >= 3) {
      return selected;
    }
  }

  return sorted.slice(0, maxCount);
}

export function orderSpotsByDistance(
  center: GeocodedPlace,
  spots: CandidateSpot[]
) {
  const remaining = [...spots];
  const ordered: CandidateSpot[] = [];
  let current = { lat: center.lat, lon: center.lon };

  while (remaining.length > 0) {
    remaining.sort((left, right) => {
      const leftDistance = distanceInKm(current.lat, current.lon, left.lat, left.lon);
      const rightDistance = distanceInKm(current.lat, current.lon, right.lat, right.lon);
      return leftDistance - rightDistance;
    });

    const next = remaining.shift();

    if (!next) {
      break;
    }

    ordered.push(next);
    current = next;
  }

  return ordered;
}
