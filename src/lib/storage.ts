// Namespaced localStorage wrapper. Guarded for SSR + quota/parse errors.

export const store = {
  get<T>(k: string, fb: T): T {
    try { if (typeof window === "undefined" || !window.localStorage) return fb; const v = window.localStorage.getItem("appido." + k); return v == null ? fb : (JSON.parse(v) as T); } catch { return fb; }
  },
  set(k: string, v: any) {
    try { if (typeof window !== "undefined" && window.localStorage) window.localStorage.setItem("appido." + k, JSON.stringify(v)); } catch {}
  },
};
