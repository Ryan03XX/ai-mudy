export function cleanValue(value) {
  if (!value) return "";
  return String(value).replace(/^=+/, "").trim();
}

export function getUrgencyClass(urgency) {
  const level = cleanValue(urgency).toLowerCase();
  if (level.includes("high") || level.includes("emergency")) return "urgency-high";
  if (level.includes("medium") || level.includes("moderate")) return "urgency-medium";
  return "urgency-low";
}

export function getMedicalRecommendation(urgency) {
  const level = cleanValue(urgency).toLowerCase();
  if (level.includes("high") || level.includes("emergency")) {
    return "Go to Emergency Department immediately.";
  }
  if (level.includes("medium") || level.includes("moderate")) {
    return "Visit a clinic or doctor within 24 hours.";
  }
  return "Monitor symptoms and rest. Visit clinic if symptoms worsen.";
}

export function getInitials(name) {
  if (!name) return "U";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
