import type { CandidateSpot, SunTimes, TripDuration } from "./types";

function toMinutes(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

function toTimeString(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60)
    .toString()
    .padStart(2, "0");
  const minutes = Math.round(totalMinutes % 60)
    .toString()
    .padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function assignTimeWindows(
  spots: CandidateSpot[],
  startTime: string,
  duration: TripDuration,
  sunTimes: SunTimes
) {
  const totalHours = duration === "half-day" ? 4 : 8;
  const slotLengthMinutes = Math.round((totalHours * 60) / Math.max(spots.length, 1));
  const startMinutes = toMinutes(startTime);
  const sunsetMinutes = toMinutes(sunTimes.sunset);

  return spots.map((spot, index) => {
    const slotStart = startMinutes + slotLengthMinutes * index;
    const slotEnd = slotStart + slotLengthMinutes - 10;
    const isLast = index === spots.length - 1;
    const bestTime =
      isLast && slotStart < sunsetMinutes
        ? `goldene Stunde bis ${sunTimes.sunset}`
        : `${toTimeString(slotStart)}-${toTimeString(slotEnd)}`;

    return {
      id: spot.id,
      bestTime,
      timeWindow: `${toTimeString(slotStart)}-${toTimeString(slotEnd)}`
    };
  });
}
