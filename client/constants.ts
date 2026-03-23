import type { PhotoStyle, TransportMode, TripPace, TripDuration } from "./types";

export const styleOptions: Array<{ value: PhotoStyle; label: string }> = [
  { value: "street", label: "Street" },
  { value: "nature", label: "Nature" },
  { value: "architecture", label: "Architecture" },
  { value: "sunset", label: "Sunset" },
  { value: "hidden-gems", label: "Hidden Gems" }
];

export const paceOptions: Array<{ value: TripPace; label: string }> = [
  { value: "relaxed", label: "Relaxed" },
  { value: "balanced", label: "Balanced" },
  { value: "packed", label: "Packed" }
];

export const durationOptions: Array<{ value: TripDuration; label: string }> = [
  { value: "half-day", label: "Half day" },
  { value: "full-day", label: "Full day" }
];

export const transportOptions: Array<{ value: TransportMode; label: string }> = [
  { value: "walk", label: "On foot" },
  { value: "bike", label: "Bike" },
  { value: "car", label: "Car" },
  { value: "public-transport", label: "Public transport" }
];
