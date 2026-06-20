// Runtime config — APPIDO_API_BASE is the deployed backend origin (no trailing slash).
// Loaded before the app bundle. Set to "" only to preview the dashboard in demo mode (seed data).
// LIVE mode (a real origin) makes the dashboard render the tenant's REAL data from the API — never seed.
window.APPIDO_API_BASE = "https://api.appido.io";
