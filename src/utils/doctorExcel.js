import * as XLSX from "xlsx";

const TEMPLATE_HEADERS = [
  "name",
  "email",
  "phone",
  "specialization",
  "category",
  "availability",
];

const TEMPLATE_ROWS = [
  {
    name: "Doctor Lee Wei Ming",
    email: "doctor.lee@medcare.com",
    phone: "+60 12-345 6789",
    specialization: "General Medicine",
    category: "General",
    availability: "Available",
  },
  {
    name: "Doctor Siti Aminah",
    email: "doctor.siti@medcare.com",
    phone: "+60 13-456 7890",
    specialization: "Cardiology",
    category: "Cardiology",
    availability: "Unavailable",
  },
];

const HEADER_ALIASES = {
  name: ["name", "doctor name", "doctor_name"],
  email: ["email", "doctor email", "doctor_email"],
  phone: ["phone", "phone number", "phone_number"],
  specialization: ["specialization", "speciality", "specialty"],
  category: ["category"],
  availability: ["availability", "is_available", "available"],
};

function normalizeHeader(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");
}

function findColumnKey(headerRow) {
  const mapping = {};

  headerRow.forEach((header, index) => {
    const normalized = normalizeHeader(header);
    if (!normalized) return;

    for (const [field, aliases] of Object.entries(HEADER_ALIASES)) {
      if (aliases.some((alias) => normalized === normalizeHeader(alias))) {
        mapping[field] = index;
      }
    }
  });

  return mapping;
}

function parseAvailability(value) {
  const text = String(value || "")
    .trim()
    .toLowerCase();

  if (!text) return null;
  if (["available", "true", "yes", "1"].includes(text)) return "Available";
  if (["unavailable", "not available", "false", "no", "0"].includes(text)) {
    return "Unavailable";
  }
  return null;
}

function cleanCell(value) {
  if (value === undefined || value === null) return "";
  return String(value).trim();
}

export function parseDoctorRowsFromSheet(rows) {
  if (!rows.length) {
    throw new Error("The uploaded file is empty.");
  }

  const headerRow = rows[0].map((cell) => cleanCell(cell));
  const columnMap = findColumnKey(headerRow);
  const requiredFields = ["name", "email", "phone", "specialization", "category", "availability"];
  const missing = requiredFields.filter((field) => columnMap[field] === undefined);

  if (missing.length > 0) {
    throw new Error(
      `Missing required columns: ${missing.join(", ")}. Download the example template and match the headers.`
    );
  }

  const doctors = [];

  for (let i = 1; i < rows.length; i += 1) {
    const row = rows[i];
    if (!row || row.every((cell) => cleanCell(cell) === "")) continue;

    const name = cleanCell(row[columnMap.name]);
    const email = cleanCell(row[columnMap.email]);
    const phone = cleanCell(row[columnMap.phone]);
    const specialization = cleanCell(row[columnMap.specialization]);
    const category = cleanCell(row[columnMap.category]);
    const availability = parseAvailability(row[columnMap.availability]);

    if (!name && !email && !phone) continue;

    if (!name || !email || !phone || !specialization || !category || availability === null) {
      throw new Error(`Row ${i + 1} has missing or invalid data. Check all required fields.`);
    }

    doctors.push({
      name,
      email,
      phone,
      specialization,
      category,
      availability,
    });
  }

  if (doctors.length === 0) {
    throw new Error("No doctor rows found in the uploaded file.");
  }

  return doctors;
}

export async function parseDoctorExcelFile(file) {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];

  if (!sheetName) {
    throw new Error("No worksheet found in the uploaded file.");
  }

  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
  return parseDoctorRowsFromSheet(rows);
}

export function downloadDoctorTemplate() {
  const worksheet = XLSX.utils.json_to_sheet(TEMPLATE_ROWS, { header: TEMPLATE_HEADERS });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Doctors");
  XLSX.writeFile(workbook, "doctor-import-template.xlsx");
}
