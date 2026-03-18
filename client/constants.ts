import type { PhotoStyle, TransportMode, TripPace, TripDuration } from "./types";

export const styleOptions: Array<{ value: PhotoStyle; label: string }> = [
  { value: "street", label: "Street" },
  { value: "nature", label: "Nature" },
  { value: "architecture", label: "Architecture" },
  { value: "sunset", label: "Sunset" },
  { value: "hidden-gems", label: "Hidden Gems" }
];

export const paceOptions: Array<{ value: TripPace; label: string }> = [
  { value: "relaxed", label: "Entspannt" },
  { value: "balanced", label: "Ausgewogen" },
  { value: "packed", label: "Viele Spots" }
];

export const durationOptions: Array<{ value: TripDuration; label: string }> = [
  { value: "half-day", label: "Halber Tag" },
  { value: "full-day", label: "Ganzer Tag" }
];

export const transportOptions: Array<{ value: TransportMode; label: string }> = [
  { value: "walk", label: "Zu Fuss" },
  { value: "bike", label: "Fahrrad" },
  { value: "car", label: "Auto" },
  { value: "public-transport", label: "Oeffis" }
];
