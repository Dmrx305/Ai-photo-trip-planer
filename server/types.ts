export type PhotoStyle =
  | "street"
  | "nature"
  | "architecture"
  | "sunset"
  | "hidden-gems";

export type TripPace = "relaxed" | "balanced" | "packed";

export type TransportMode = "walk" | "bike" | "car" | "public-transport";

export type TripDuration = "half-day" | "full-day";

export type TripRequest = {
  city: string;
  duration: TripDuration;
  styles: PhotoStyle[];
  pace: TripPace;
  startTime: string;
  transport: TransportMode;
  budget: number | null;
  vibe: string;
};

export type Coordinate = {
  lat: number;
  lon: number;
};

export type CandidateSpot = {
  id: string;
  name: string;
  type: string;
  lat: number;
  lon: number;
  tags: string[];
  score: number;
};

export type PlannedSpot = CandidateSpot & {
  rank: number;
  bestTime: string;
  timeWindow: string;
  reason: string;
  description: string;
  photoIdeas: string[];
};

export type TripPlan = {
  title: string;
  summary: string;
  routePolyline: Coordinate[];
  notes: string[];
  generatedWith: "ollama" | "fallback";
  spots: PlannedSpot[];
};

export type GeocodedPlace = {
  displayName: string;
  lat: number;
  lon: number;
  boundingBox?: [number, number, number, number];
};

export type SunTimes = {
  sunrise: string;
  sunset: string;
};
