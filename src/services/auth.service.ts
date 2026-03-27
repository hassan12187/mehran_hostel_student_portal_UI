// src/services/auth.service.ts

const BASE =
  (import.meta as any).env?.VITE_API_URL ?? "http://localhost:8000/api"

// ─── isTokenExpired ───────────────────────────────────────────────────────────
/**
 * Returns true if the token is missing, malformed, or expires within 60 seconds.
 * 60-second buffer prevents edge cases where the token expires mid-request.
 */
export function isTokenExpired(token: string | null | undefined): boolean {
  if (!token) return true
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return true
    // base64url → base64
    const base64  = parts[1].replace(/-/g, "+").replace(/_/g, "/")
    const payload = JSON.parse(atob(base64))
    if (typeof payload.exp !== "number") return true
    return payload.exp * 1000 - Date.now() < 60_000
  } catch {
    return true
  }
}

// ─── Singleton refresh promise — prevents race conditions ─────────────────────
let refreshPromise: Promise<string | null> | null = null

export async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise

  refreshPromise = fetch(`${BASE}/auth/refresh`, {
    method:      "POST",
    credentials: "include",
    headers:     { "Content-Type": "application/json" },
  })
    .then(async res => {
      if (!res.ok) return null
      const json = await res.json()
      return (json.accessToken as string) ?? null
    })
    .catch(() => null)
    .finally(() => { refreshPromise = null })

  return refreshPromise
}

export async function logout(): Promise<void> {
  try {
    await fetch(`${BASE}/auth/logout`, {
      method:      "POST",
      credentials: "include",
      headers:     { "Content-Type": "application/json" },
    })
  } catch { /* fire-and-forget */ }
}

export async function loginRequest(
  email:    string,
  password: string
): Promise<{ accessToken: string; data: { role: string; username: string } }> {
  const res  = await fetch(`${BASE}/auth/login`, {
    method:      "POST",
    credentials: "include",
    headers:     { "Content-Type": "application/json" },
    body:         JSON.stringify({ email, password }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.message ?? "Login failed.")
  return json
}

export async function forgotPasswordRequest(email: string): Promise<void> {
  const res  = await fetch(`${BASE}/auth/forgot-password`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ email }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.message ?? "Request failed.")
}

export async function resetPasswordRequest(data: {
  email:           string
  code:            string
  newPassword:     string
  confirmPassword: string
}): Promise<void> {
  const res  = await fetch(`${BASE}/auth/reset-password`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(data),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.message ?? "Reset failed.")
}