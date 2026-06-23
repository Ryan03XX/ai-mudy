export const WEBHOOKS = {
  TRIAGE_TEST: "http://localhost:5678/webhook-test/882aae53-3dfb-4a02-8abc-d71abbb83d73",
  TRIAGE_PRODUCTION: "http://localhost:5678/webhook/882aae53-3dfb-4a02-8abc-d71abbb83d73",

  REGISTER_DOCTOR_TEST: "http://localhost:5678/webhook-test/register-doctor",
  REGISTER_DOCTOR_PRODUCTION: "http://localhost:5678/webhook/register-doctor",

  HISTORY_TEST: "http://localhost:5678/webhook-test/history",
  HISTORY_PRODUCTION: "http://localhost:5678/webhook/history",
};

// Set to false after publishing the n8n workflow
export const IS_TEST_MODE = true;
