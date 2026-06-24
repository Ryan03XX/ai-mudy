import { cleanValue } from "./helpers";

export function isHighUrgency(urgency) {
  const level = cleanValue(urgency).toLowerCase();
  return level.includes("high") || level.includes("emergency");
}

export function isMediumUrgency(urgency) {
  const level = cleanValue(urgency).toLowerCase();
  return level.includes("medium") || level.includes("moderate");
}

export function isLowUrgency(urgency) {
  return !isHighUrgency(urgency) && !isMediumUrgency(urgency);
}

export function shouldShowBooking(urgency) {
  return isHighUrgency(urgency) || isMediumUrgency(urgency);
}
