import cloudbase from "@cloudbase/js-sdk";

const app = cloudbase.init({
  env: "sweet-notebook-9guaf6n4a0e796e8",
});

let authReady: Promise<void> | null = null;

export function ensureAuth(): Promise<void> {
  if (!authReady) {
    authReady = (async () => {
      const auth = app.auth({ persistence: "local" });
      const loginState = await auth.getLoginState();
      if (!loginState) {
        await auth.anonymousAuthProvider().signIn();
      }
    })();
  }
  return authReady;
}

export function getDb() {
  return app.database();
}

export function getApp() {
  return app;
}

// --- Couple ID Management ---
const COUPLE_KEY = "love-notebook-couple-id";

export function getCoupleId(): string {
  let id = localStorage.getItem(COUPLE_KEY);
  if (!id) {
    id = generateCoupleCode();
    localStorage.setItem(COUPLE_KEY, id);
  }
  return id;
}

export function setCoupleId(id: string) {
  localStorage.setItem(COUPLE_KEY, id);
}

export function hasCoupleId(): boolean {
  return !!localStorage.getItem(COUPLE_KEY);
}

function generateCoupleCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}
