export type PhotoStyle =
  | "street"
  | "nature"
  | "architecture"
  | "sunset"
  | "hidden-gems";

export type TripPace = "relaxed" | "balanced" | "packed";

export type TransportMode = "walk" | "bike" | "car" | "public-transport";

export type TripDuration = "half-day" | "full-day";

export type Coordinate = {
  lat: number;
  lon: number;
};

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

export type Spot = {
  id: string;
  name: string;
  type: string;
  lat: number;
  lon: number;
  tags: string[];
};

export type PlannedSpot = Spot & {
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
