import { create } from "zustand";

const storageKey = "palurn.company.session";
const idleLimit = 3 * 60 * 60 * 1000;
const touchGap = 15_000;

type StoredSession = {
  token: string;
  name: string;
  lastActive: number;
};

type SessionState = {
  token: string | null;
  name: string | null;
  loggedOut: boolean;
  setSession: (session: { token: string | null; name: string }) => void;
  clearSession: () => void;
  touchActivity: () => void;
  expireIfIdle: () => void;
};

function readStoredSession(): StoredSession | null {
  if (typeof localStorage === "undefined") return null;
  const raw = localStorage.getItem(storageKey);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as StoredSession;
    if (!parsed.token || typeof parsed.lastActive !== "number") {
      localStorage.removeItem(storageKey);
      return null;
    }
    if (Date.now() - parsed.lastActive >= idleLimit) {
      localStorage.removeItem(storageKey);
      return null;
    }
    return parsed;
  } catch {
    localStorage.removeItem(storageKey);
    return null;
  }
}

function writeStoredSession(session: StoredSession | null) {
  if (typeof localStorage === "undefined") return;
  if (!session?.token) {
    localStorage.removeItem(storageKey);
    return;
  }
  localStorage.setItem(storageKey, JSON.stringify(session));
}

const restored = readStoredSession();
let lastTouch = restored?.lastActive ?? 0;

export const useSessionStore = create<SessionState>((set, get) => ({
  token: restored?.token ?? null,
  name: restored?.name ?? null,
  loggedOut: false,
  setSession: (session) => {
    const lastActive = Date.now();
    lastTouch = lastActive;
    writeStoredSession(
      session.token ? { token: session.token, name: session.name, lastActive } : null,
    );
    set({
      token: session.token,
      name: session.name,
      loggedOut: false,
    });
  },
  clearSession: () => {
    lastTouch = 0;
    writeStoredSession(null);
    set({
      token: null,
      name: null,
      loggedOut: true,
    });
  },
  touchActivity: () => {
    const { token, name } = get();
    if (!token) return;
    const now = Date.now();
    if (now - lastTouch < touchGap) return;
    lastTouch = now;
    writeStoredSession({ token, name: name ?? "", lastActive: now });
  },
  expireIfIdle: () => {
    if (!get().token) return;
    if (!readStoredSession()) {
      get().clearSession();
    }
  },
}));
