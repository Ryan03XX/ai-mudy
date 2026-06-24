export const TIME_SLOTS = ["1:00 PM", "2:00 PM", "3:00 PM"];

// Hardcoded booked slots by date (can be replaced with API/history later)
export const BOOKED_SLOTS = {
  "2025-06-20": ["1:00 PM"],
  "2025-06-21": ["1:00 PM"],
  "2025-06-22": ["2:00 PM"],
};

export function isSlotBooked(date, slot) {
  if (!date) return false;
  return (BOOKED_SLOTS[date] || []).includes(slot);
}

export function getSlotLabel(slot, date) {
  const booked = isSlotBooked(date, slot);
  return `${slot} - ${booked ? "Booked" : "Available"}`;
}
