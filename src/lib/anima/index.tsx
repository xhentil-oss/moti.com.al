/**
 * Shim drop-in që zëvendëson @animaapp/playground-react-sdk.
 *
 * Ekspozon të njëjtin API (AnimaProvider, useQuery, useLazyQuery, useMutation, type Location)
 * por i drejton thirrjet te backend-i ynë Express + MariaDB (/api/locations/*).
 * Kështu AdminPage.tsx dhe albanianCities.ts mbeten pothuajse pa ndryshim — vetëm
 * ndryshon rruga e import-it.
 */
import React, { useState, useEffect, useCallback } from "react";

// Baza e API-t. Në prod (Nginx same-origin) mjafton "/api".
const API_BASE: string = (import.meta as any).env?.VITE_API_BASE || "/api";

// ─── Tipi Location (i njëjtë me atë që priste SDK) ────────────────────────────
export interface Location {
  id: string;
  name: string;
  nameAl: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  population: number;
  isPopular: boolean;
  createdAt?: string;
  updatedAt?: string;
}

type Filters = Record<string, any>;

// ─── Token i admin-it ─────────────────────────────────────────────────────────
const TOKEN_KEY = "moti-admin-token";
export function getToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
}
export function setToken(token: string) {
  sessionStorage.setItem(TOKEN_KEY, token);
}
export function clearToken() {
  sessionStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_KEY);
}
export function isAuthenticated(): boolean {
  return !!getToken();
}

/** Login admin — kthen token-in dhe e ruan në sessionStorage. */
export async function login(password: string, username = "admin") {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(e.error || "Login dështoi");
  }
  const data = await res.json();
  setToken(data.token);
  return data;
}

function endpointFor(entity: string): string {
  return entity === "Location" ? "locations" : entity.toLowerCase();
}

function authHeaders(): Record<string, string> {
  const t = getToken();
  return { "Content-Type": "application/json", ...(t ? { Authorization: `Bearer ${t}` } : {}) };
}

// ─── Bus i thjeshtë revalidimi: pas çdo mutation, ri-ekzekuto query-t aktive ──
let listeners = new Set<() => void>();
function notifyMutation() {
  listeners.forEach((l) => l());
}

async function runQuery<T = Location>(entity: string, filters?: Filters): Promise<T[]> {
  const res = await fetch(`${API_BASE}/${endpointFor(entity)}/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(filters || {}),
  });
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(e.error || `Query dështoi (${res.status})`);
  }
  return res.json();
}

// ─── useQuery ─────────────────────────────────────────────────────────────────
export function useQuery<T = Location>(entity: string, filters?: Filters) {
  const [data, setData] = useState<T[] | null>(null);
  const [isPending, setPending] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const key = JSON.stringify(filters || {});

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setPending(true);
      try {
        const rows = await runQuery<T>(entity, JSON.parse(key));
        if (!cancelled) {
          setData(rows);
          setError(null);
        }
      } catch (e: any) {
        if (!cancelled) setError(e);
      } finally {
        if (!cancelled) setPending(false);
      }
    };
    load();
    const listener = () => load();
    listeners.add(listener);
    return () => {
      cancelled = true;
      listeners.delete(listener);
    };
  }, [entity, key]);

  return { data, isPending, error };
}

// ─── useLazyQuery ─────────────────────────────────────────────────────────────
export function useLazyQuery<T = Location>(entity: string) {
  const [isPending, setPending] = useState(false);
  const query = useCallback(
    async (filters?: Filters): Promise<T[]> => {
      setPending(true);
      try {
        return await runQuery<T>(entity, filters);
      } finally {
        setPending(false);
      }
    },
    [entity]
  );
  return { query, isPending };
}

// ─── useMutation ──────────────────────────────────────────────────────────────
export function useMutation(entity: string) {
  const [isPending, setPending] = useState(false);
  const base = `${API_BASE}/${endpointFor(entity)}`;

  const create = useCallback(
    async (payload: Record<string, any>) => {
      setPending(true);
      try {
        const res = await fetch(base, { method: "POST", headers: authHeaders(), body: JSON.stringify(payload) });
        if (!res.ok) {
          const e = await res.json().catch(() => ({}));
          throw new Error(e.error || "Krijim dështoi");
        }
        const row = await res.json();
        notifyMutation();
        return row;
      } finally {
        setPending(false);
      }
    },
    [base]
  );

  const update = useCallback(
    async (id: string, payload: Record<string, any>) => {
      setPending(true);
      try {
        const res = await fetch(`${base}/${encodeURIComponent(id)}`, {
          method: "PATCH",
          headers: authHeaders(),
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const e = await res.json().catch(() => ({}));
          throw new Error(e.error || "Përditësim dështoi");
        }
        const row = await res.json();
        notifyMutation();
        return row;
      } finally {
        setPending(false);
      }
    },
    [base]
  );

  const remove = useCallback(
    async (id: string) => {
      setPending(true);
      try {
        const res = await fetch(`${base}/${encodeURIComponent(id)}`, { method: "DELETE", headers: authHeaders() });
        if (!res.ok) {
          const e = await res.json().catch(() => ({}));
          throw new Error(e.error || "Fshirje dështoi");
        }
        notifyMutation();
        return true;
      } finally {
        setPending(false);
      }
    },
    [base]
  );

  return { create, update, remove, isPending };
}

// ─── AnimaProvider (passthrough — s'na duhet më asnjë kontekst i jashtëm) ─────
export function AnimaProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
