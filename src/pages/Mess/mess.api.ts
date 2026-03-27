// src/services/messMenu.api.ts
export type DayOfWeek = "Monday"|"Tuesday"|"Wednesday"|"Thursday"|"Friday"|"Saturday"|"Sunday"

export interface Meal {
  items:     string[]
  startTime: string
  endTime:   string
}

export interface MessMenu {
  _id:       string
  dayOfWeek: DayOfWeek
  breakfast: Meal
  lunch:     Meal
  dinner:    Meal
  createdAt: string
  updatedAt: string
}

const BASE =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_API_URL) ||
  "http://localhost:8000/api"

async function req<T>(url: string, token: string): Promise<T> {
  const res  = await fetch(url, { headers: { Authorization:`Bearer ${token}` } })
  const json = await res.json()
  if (!res.ok) throw new Error(json.message ?? `Request failed: ${res.status}`)
  return json as T
}

export const MessMenuAPI = {
  getWeekly(token: string): Promise<{ success:boolean; data:MessMenu[] }> {
    return req(`${BASE}/student/mess-menu`, token)
  },
  getByDay(day: DayOfWeek, token: string): Promise<{ success:boolean; data:MessMenu }> {
    return req(`${BASE}/student/mess-menu/${day}`, token)
  },
  getToday(token: string): Promise<{ success:boolean; data:MessMenu }> {
    return req(`${BASE}/student/mess-menu/today`, token)
  },
}