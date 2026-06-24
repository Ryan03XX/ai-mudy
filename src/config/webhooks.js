export const WEBHOOKS = {
  TRIAGE_TEST: "http://localhost:5678/webhook-test/triage",
  TRIAGE_PRODUCTION: "http://localhost:5678/webhook/triage",

  REGISTER_DOCTOR_TEST: "http://localhost:5678/webhook-test/register-doctor",
  REGISTER_DOCTOR_PRODUCTION: "http://localhost:5678/webhook/register-doctor",

  HISTORY_TEST: "http://localhost:5678/webhook-test/history",
  HISTORY_PRODUCTION: "http://localhost:5678/webhook/history",

  MY_APPOINTMENTS_TEST: "http://localhost:5678/webhook-test/my-appointments",
  MY_APPOINTMENTS_PRODUCTION: "http://localhost:5678/webhook/my-appointments",

  BOOKING_TEST: "http://localhost:5678/webhook-test/book-appointment",
  BOOKING_PRODUCTION: "http://localhost:5678/webhook/book-appointment",

  LIST_DOCTORS_TEST: "http://localhost:5678/webhook-test/doctors",
  LIST_DOCTORS_PRODUCTION: "http://localhost:5678/webhook/doctors",

  ADMIN_APPOINTMENTS_TEST: "http://localhost:5678/webhook-test/admin-appointments",
  ADMIN_APPOINTMENTS_PRODUCTION: "http://localhost:5678/webhook/admin-appointments",

  ADMIN_DASHBOARD_TEST: "http://localhost:5678/webhook-test/admin-dashboard",
  ADMIN_DASHBOARD_PRODUCTION: "http://localhost:5678/webhook/admin-dashboard",

  AVAILABLE_SLOTS_PRODUCTION: "http://localhost:5678/webhook/available-slots",
};

// Production webhooks — workflows must be Active in n8n (no manual Execute needed)
export const IS_TEST_MODE = false;

export const TRIAGE_WEBHOOK_URL = IS_TEST_MODE
  ? WEBHOOKS.TRIAGE_TEST
  : WEBHOOKS.TRIAGE_PRODUCTION;

export const BOOK_APPOINTMENT_WEBHOOK_URL = IS_TEST_MODE
  ? WEBHOOKS.BOOKING_TEST
  : WEBHOOKS.BOOKING_PRODUCTION;

export const ADMIN_APPOINTMENTS_WEBHOOK_URL = IS_TEST_MODE
  ? WEBHOOKS.ADMIN_APPOINTMENTS_TEST
  : WEBHOOKS.ADMIN_APPOINTMENTS_PRODUCTION;

export const DOCTORS_WEBHOOK_URL = IS_TEST_MODE
  ? WEBHOOKS.LIST_DOCTORS_TEST
  : WEBHOOKS.LIST_DOCTORS_PRODUCTION;

export const ADMIN_DASHBOARD_WEBHOOK_URL = IS_TEST_MODE
  ? WEBHOOKS.ADMIN_DASHBOARD_TEST
  : WEBHOOKS.ADMIN_DASHBOARD_PRODUCTION;

export const AVAILABLE_SLOTS_WEBHOOK_URL = WEBHOOKS.AVAILABLE_SLOTS_PRODUCTION;

export const MY_APPOINTMENTS_WEBHOOK_URL = IS_TEST_MODE
  ? WEBHOOKS.MY_APPOINTMENTS_TEST
  : WEBHOOKS.MY_APPOINTMENTS_PRODUCTION;
