"use client"

import React, { useState } from "react"
import { useNavigate }  from "react-router-dom"
import { useQuery }     from "@tanstack/react-query"
import {
  Home, CreditCard, AlertCircle, Utensils, BarChart3,
  Calendar, Bell, ChevronRight, TrendingUp, Clock,
  CheckCircle2, XCircle, Loader2, User, Building2,
  Coffee, Moon, UtensilsCrossed, Wifi, ShieldCheck,
  AlertTriangle,
} from "lucide-react"
import { useCustom }    from "../../context/Store"
import {
  StudentAPI,
  type StudentDashboard as IDashboard,
  type MealType,
  type MealStatus,
  type AttendanceEntry,
} from "../../services/student.api.js"

// ─── Meal icon map ────────────────────────────────────────────────────────────
const MEAL_ICON: Record<MealType, React.ReactNode> = {
  Breakfast: <Coffee         size={14}/>,
  Lunch:     <UtensilsCrossed size={14}/>,
  Dinner:    <Moon           size={14}/>,
}

const MEAL_COLOR: Record<MealType, string> = {
  Breakfast: "#f59e0b",
  Lunch:     "var(--accent)",
  Dinner:    "#8b5cf6",
}

const STATUS_CFG: Record<MealStatus, { color: string; bg: string; icon: React.ReactNode; label: string }> = {
  Present: { color: "var(--green)",  bg: "rgba(16,185,129,.12)", icon: <CheckCircle2 size={13}/>, label: "Present" },
  Absent:  { color: "var(--red)",    bg: "rgba(239,68,68,.12)",  icon: <XCircle      size={13}/>, label: "Absent"  },
  Leave:   { color: "var(--amber)",  bg: "rgba(245,158,11,.12)", icon: <Clock        size={13}/>, label: "Leave"   },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function pct(a: number, b: number) {
  if (!b) return 0
  return Math.min(100, Math.round((a / b) * 100))
}

function fmt(n: number | undefined) {
  return (n ?? 0).toLocaleString("en-PK")
}

// ─── Greeting ─────────────────────────────────────────────────────────────────
function greeting() {
  const h = new Date().getHours()
  if (h < 12) return "Good morning"
  if (h < 17) return "Good afternoon"
  return "Good evening"
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ name, size = 48 }: { name: string; size?: number }) {
  const initials = (name ?? "?").split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase()
  const hue      = (name ?? "").split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 360
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.28, flexShrink: 0,
      background: `hsl(${hue},45%,30%)`,
      border: `2px solid hsl(${hue},45%,45%)`,
      color: `hsl(${hue},80%,85%)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.32, fontWeight: 800,
      fontFamily: "'DM Serif Display',serif",
    }}>
      {initials}
    </div>
  )
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, colorVar, sub, onClick }: {
  icon: React.ReactNode; label: string
  value: string | number; colorVar: string
  sub?: string; onClick?: () => void
}) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: "var(--card)", border: "1px solid var(--border)",
        borderRadius: 16, padding: "18px 20px",
        display: "flex", alignItems: "center", gap: 14,
        cursor: onClick ? "pointer" : "default",
        transition: "transform .2s, box-shadow .2s",
        transform: hov ? "translateY(-2px)" : "none",
        boxShadow: hov ? "var(--stat-shadow)" : "none",
      }}
    >
      <div style={{
        width: 42, height: 42, borderRadius: 12, flexShrink: 0,
        background: `color-mix(in srgb, ${colorVar} 12%, transparent)`,
        color: colorVar,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>
          {label}
        </div>
        <div style={{ fontSize: 20, fontWeight: 800, color: "var(--text-pri)", lineHeight: 1, fontFamily: "'DM Serif Display',serif" }}>
          {value}
        </div>
        {sub && <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 3 }}>{sub}</div>}
      </div>
      {onClick && <ChevronRight size={15} color="var(--text-muted)" />}
    </div>
  )
}

// ─── Section card ─────────────────────────────────────────────────────────────
function Card({ title, icon, children, action }: {
  title: string; icon: React.ReactNode
  children: React.ReactNode
  action?: { label: string; onClick: () => void }
}) {
  return (
    <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 20, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--accent-lo)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {icon}
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-pri)", fontFamily: "'DM Serif Display',serif" }}>{title}</span>
        </div>
        {action && (
          <button onClick={action.onClick} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "var(--accent)", display: "flex", alignItems: "center", gap: 4 }}>
            {action.label}<ChevronRight size={13}/>
          </button>
        )}
      </div>
      <div style={{ padding: "20px 22px" }}>{children}</div>
    </div>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton({ w, h, r = 8 }: { w: number | string; h: number; r?: number }) {
  return (
    <div style={{ width: w, height: h, borderRadius: r, background: "var(--border)", animation: "shimmer 1.4s ease-in-out infinite" }} />
  )
}

// ─── Fee progress ─────────────────────────────────────────────────────────────
function FeeProgress({ paid, total, outstanding, overdue }: {
  paid: number; total: number; outstanding: number; overdue: number
}) {
  const p = pct(paid, total)
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Progress bar */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Payment progress</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: p >= 100 ? "var(--green)" : "var(--accent)" }}>{p}%</span>
        </div>
        <div style={{ height: 8, borderRadius: 4, background: "var(--border)", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${p}%`, background: p >= 100 ? "var(--green)" : "var(--accent)", borderRadius: 4, transition: "width .6s ease" }} />
        </div>
      </div>

      {/* Fee tiles */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {[
          { label: "Total Paid",   value: `PKR ${fmt(paid)}`,        color: "var(--green)" },
          { label: "Outstanding",  value: `PKR ${fmt(outstanding)}`,  color: outstanding > 0 ? "var(--red)" : "var(--green)" },
          { label: "Total Fees",   value: `PKR ${fmt(total)}`,        color: "var(--text-pri)" },
          { label: "Overdue",      value: overdue > 0 ? `${overdue} invoice${overdue !== 1 ? "s" : ""}` : "None",
            color: overdue > 0 ? "var(--red)" : "var(--green)" },
        ].map(f => (
          <div key={f.label} style={{ padding: "10px 12px", background: "var(--surface)", borderRadius: 12, border: "1px solid var(--border)" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{f.label}</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: f.color, fontFamily: "'DM Serif Display',serif" }}>{f.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Today's meals ────────────────────────────────────────────────────────────
function TodayMeals({ meals }: { meals: AttendanceEntry[] }) {
  const all: MealType[] = ["Breakfast", "Lunch", "Dinner"]

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {all.map(meal => {
        const record = meals.find(m => m.mealType === meal)
        const cfg    = record ? STATUS_CFG[record.status] : null
        const color  = MEAL_COLOR[meal]

        return (
          <div key={meal} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", background: "var(--surface)", borderRadius: 12, border: "1px solid var(--border)" }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, flexShrink: 0, background: `color-mix(in srgb, ${color} 12%, transparent)`, color, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {MEAL_ICON[meal]}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-pri)" }}>{meal}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                {meal === "Breakfast" ? "7–9 AM" : meal === "Lunch" ? "12–2 PM" : "7–9 PM"}
              </div>
            </div>
            {cfg ? (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, color: cfg.color, background: cfg.bg }}>
                {cfg.icon}{cfg.label}
              </span>
            ) : (
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Not marked</span>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Quick actions ────────────────────────────────────────────────────────────
function QuickActions({ navigate }: { navigate: (path: string) => void }) {
  const actions = [
    { label: "Raise Complaint",  color: "var(--amber)",  bg: "rgba(245,158,11,.10)",  path: "/student/complaints/new" },
    { label: "View Invoices",    color: "var(--accent)",  bg: "var(--accent-lo)",      path: "/student/invoices"       },
    { label: "Mess Menu",        color: "var(--green)",  bg: "rgba(16,185,129,.10)",  path: "/student/mess-menu"      },
    { label: "Attendance",       color: "#8b5cf6",       bg: "rgba(139,92,246,.10)",  path: "/student/attendance"     },
    { label: "My Profile",       color: "#06b6d4",       bg: "rgba(6,182,212,.10)",   path: "/student/profile"        },
    { label: "Settings",         color: "var(--text-sec)", bg: "var(--input-bg)",     path: "/student/settings"       },
  ]
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      {actions.map(a => (
        <button
          key={a.label}
          onClick={() => navigate(a.path)}
          style={{ padding: "10px 14px", borderRadius: 12, border: `1px solid var(--border)`, background: a.bg, color: a.color, fontSize: 12, fontWeight: 700, cursor: "pointer", textAlign: "left", transition: "transform .15s", display: "flex", alignItems: "center", justifyContent: "space-between" }}
          onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)")}
          onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.transform = "none")}
        >
          {a.label}<ChevronRight size={13}/>
        </button>
      ))}
    </div>
  )
}

// ─── Main dashboard ───────────────────────────────────────────────────────────
const StudentDashboard: React.FC = () => {
  const { token }  = useCustom() as { token: string }
  const navigate   = useNavigate()

  const { data, isLoading, error } = useQuery({
    queryKey:  ["student", "dashboard"],
    queryFn:   () => StudentAPI.getDashboard(token),
    staleTime: 2 * 60_000,
    enabled:   !!token,
  })

  const d = data?.data

  const profile      = d?.profile
  const fees         = d?.fees
  const pendingComps = d?.complaints?.pendingCount ?? 0
  const todayMeals   = d?.attendance?.today ?? []
  const subscription = d?.subscription

  const room = (profile?.room_id as any)?.room_no ?? null

  // ── Stat cards data ────────────────────────────────────────────────────────
  const stats = [
    {
      icon: <Home       size={18}/>,
      label: "Room",
      value: room ?? "Not Assigned",
      colorVar: "var(--accent)",
      sub: (profile?.room_id as any)?.block ? `Block ${(profile?.room_id as any).block}` : undefined,
      onClick: () => navigate("/student/profile"),
    },
    {
      icon: <CreditCard size={18}/>,
      label: "Amount Paid",
      value: fees?.totalPaid ? `PKR ${fmt(fees.totalPaid)}` : "PKR 0",
      colorVar: "var(--green)",
      sub: fees?.totalOutstanding ? `PKR ${fmt(fees.totalOutstanding)} due` : "All clear",
      onClick: () => navigate("/student/invoices"),
    },
    {
      icon: <AlertCircle size={18}/>,
      label: "Pending Complaints",
      value: pendingComps,
      colorVar: pendingComps > 0 ? "var(--red)" : "var(--green)",
      sub: pendingComps > 0 ? "Awaiting resolution" : "No open issues",
      onClick: () => navigate("/student/complaints"),
    },
    {
      icon: <Utensils  size={18}/>,
      label: "Mess Status",
      value: subscription ? subscription.status : "Inactive",
      colorVar: subscription?.status === "Active" ? "var(--green)" : "var(--amber)",
      sub: subscription?.planType ?? "No subscription",
      onClick: () => navigate("/student/subscription"),
    },
  ]

  // ── Loading skeleton ───────────────────────────────────────────────────────
  if (isLoading) return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", color:"var(--text-pri)", display:"flex", flexDirection:"column", gap:24 }}>
      {/* Header skeleton */}
      <div style={{ display:"flex", alignItems:"center", gap:16, padding:"24px", background:"var(--card)", borderRadius:20, border:"1px solid var(--border)" }}>
        <Skeleton w={56} h={56} r={14}/>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          <Skeleton w={200} h={20}/>
          <Skeleton w={140} h={14}/>
        </div>
      </div>
      {/* Stats skeleton */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:14 }}>
        {[1,2,3,4].map(i => <Skeleton key={i} w="100%" h={80} r={16}/>)}
      </div>
      {/* Cards skeleton */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        <Skeleton w="100%" h={300} r={20}/>
        <Skeleton w="100%" h={300} r={20}/>
      </div>
    </div>
  )

  if (error) return (
    <div style={{ display:"flex", alignItems:"center", gap:10, padding:"20px", borderRadius:16, background:"rgba(239,68,68,.1)", color:"var(--red)", fontSize:14, border:"1px solid rgba(239,68,68,.2)" }}>
      <AlertTriangle size={18}/>{(error as Error).message}
    </div>
  )

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", color:"var(--text-pri)", display:"flex", flexDirection:"column", gap:24 }}>

      {/* ── Hero / Welcome ── */}
      <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:20, padding:"24px 28px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:16, flexWrap:"wrap" }}>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <Avatar name={profile?.student_name ?? "Student"} size={56}/>
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:"var(--accent)", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4 }}>
              {greeting()}
            </div>
            <h1 style={{ margin:0, fontSize:24, fontWeight:800, color:"var(--text-pri)", fontFamily:"'DM Serif Display',serif", lineHeight:1.1 }}>
              {profile?.student_name ?? "—"}
            </h1>
            <div style={{ fontSize:13, color:"var(--text-sec)", marginTop:4, display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
              <span style={{ fontFamily:"'JetBrains Mono',monospace" }}>
                Roll #{profile?.student_roll_no ?? "—"}
              </span>
              <span style={{ width:3, height:3, borderRadius:"50%", background:"var(--border)" }}/>
              <span style={{ display:"flex", alignItems:"center", gap:4 }}>
                <span style={{ width:6, height:6, borderRadius:"50%", background: profile?.status === "approved" ? "var(--green)" : "var(--amber)" }}/>
                {profile?.status ? profile.status.charAt(0).toUpperCase() + profile.status.slice(1) : "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Today's date */}
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:11, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.07em" }}>Today</div>
          <div style={{ fontSize:18, fontWeight:800, color:"var(--text-pri)", fontFamily:"'DM Serif Display',serif" }}>
            {new Date().toLocaleDateString("en-PK", { weekday:"long", day:"numeric", month:"long" })}
          </div>
        </div>
      </div>

      {/* ── Stats grid ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:14 }}>
        {stats.map(s => (
          <StatCard key={s.label} {...s}/>
        ))}
      </div>

      {/* ── Main content ── */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>

        {/* Left column */}
        <div style={{ display:"flex", flexDirection:"column", gap:20 }}>

          {/* Profile info */}
          <Card title="My Information" icon={<User size={14}/>} action={{ label:"Edit Profile", onClick:()=>navigate("/student/settings") }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {[
                { label:"Full Name",   value: profile?.student_name                                                                      },
                { label:"Email",       value: profile?.student_email                                                                     },
                { label:"Room",        value: room ?? "Not assigned"                                                                     },
                { label:"Mess",        value: profile?.messEnabled ? "Enabled" : "Disabled"                                             },
                { label:"Joined",      value: profile?.hostelJoinDate ? new Date(profile.hostelJoinDate).toLocaleDateString("en-PK", { day:"numeric", month:"short", year:"numeric" }) : "—" },
              ].map(f => (
                <div key={f.label} style={{ padding:"10px 12px", background:"var(--surface)", borderRadius:12, border:"1px solid var(--border)" }}>
                  <div style={{ fontSize:10, fontWeight:700, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:3 }}>{f.label}</div>
                  <div style={{ fontSize:13, fontWeight:600, color:"var(--text-pri)", wordBreak:"break-word" }}>{f.value ?? "—"}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Fee status */}
          <Card title="Fee Status" icon={<CreditCard size={14}/>} action={{ label:"View Invoices", onClick:()=>navigate("/student/invoices") }}>
            {fees ? (
              <FeeProgress
                paid={fees.totalPaid}
                total={fees.totalPaid + fees.totalOutstanding}
                outstanding={fees.totalOutstanding}
                overdue={fees.overdueCount}
              />
            ) : (
              <div style={{ textAlign:"center", color:"var(--text-muted)", fontSize:13, padding:"20px 0" }}>No fee data available.</div>
            )}
          </Card>
        </div>

        {/* Right column */}
        <div style={{ display:"flex", flexDirection:"column", gap:20 }}>

          {/* Today's meals */}
          <Card title="Today's Meals" icon={<UtensilsCrossed size={14}/>} action={{ label:"View Menu", onClick:()=>navigate("/student/mess-menu") }}>
            <TodayMeals meals={todayMeals}/>
          </Card>

          {/* Subscription */}
          <Card title="Mess Subscription" icon={<Utensils size={14}/>}>
            {subscription ? (
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 14px", background:"var(--surface)", borderRadius:12, border:"1px solid var(--border)" }}>
                  <div>
                    <div style={{ fontSize:10, fontWeight:700, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:3 }}>Plan</div>
                    <div style={{ fontSize:15, fontWeight:800, color:"var(--text-pri)", fontFamily:"'DM Serif Display',serif" }}>{subscription.planType}</div>
                  </div>
                  <span style={{ padding:"4px 12px", borderRadius:20, fontSize:11, fontWeight:700, background: subscription.status === "Active" ? "rgba(16,185,129,.12)" : "rgba(239,68,68,.12)", color: subscription.status === "Active" ? "var(--green)" : "var(--red)" }}>
                    {subscription.status}
                  </span>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                  <div style={{ padding:"10px 12px", background:"var(--surface)", borderRadius:12, border:"1px solid var(--border)" }}>
                    <div style={{ fontSize:10, fontWeight:700, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:3 }}>Monthly Fee</div>
                    <div style={{ fontSize:14, fontWeight:800, color:"var(--accent)", fontFamily:"'DM Serif Display',serif" }}>PKR {fmt(subscription.monthlyFee)}</div>
                  </div>
                  <div style={{ padding:"10px 12px", background:"var(--surface)", borderRadius:12, border:"1px solid var(--border)" }}>
                    <div style={{ fontSize:10, fontWeight:700, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:3 }}>Valid Until</div>
                    <div style={{ fontSize:13, fontWeight:700, color:"var(--text-pri)" }}>
                      {subscription.validUntil ? new Date(subscription.validUntil).toLocaleDateString("en-PK", { day:"numeric", month:"short", year:"numeric" }) : "Indefinite"}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign:"center", padding:"20px 0", color:"var(--text-muted)" }}>
                <Utensils size={28} style={{ marginBottom:8, opacity:.3 }}/>
                <div style={{ fontSize:13, fontWeight:600 }}>No active mess subscription</div>
                <div style={{ fontSize:12, marginTop:4 }}>Contact the hostel office to subscribe</div>
              </div>
            )}
          </Card>

          {/* Quick actions */}
          <Card title="Quick Actions" icon={<TrendingUp size={14}/>}>
            <QuickActions navigate={navigate}/>
          </Card>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
        @keyframes shimmer { 0%,100%{opacity:.4} 50%{opacity:.8} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  )
}

export default StudentDashboard