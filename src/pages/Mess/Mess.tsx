"use client"

import React, { useState, useMemo, type FormEvent } from "react"
import {
  Utensils, ClipboardList, CreditCard, Bell, Star,
  Clock, CheckCircle2, XCircle, AlertTriangle, ChevronRight,
  Calendar, TrendingUp, Download, Loader2, Coffee,
  UtensilsCrossed, Moon, Send, X, Plus,
} from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useCustom } from "../../context/Store"
import {
  StudentAPI,
  type MealType, type MealStatus, type AttendanceEntry,
} from "../../services/student.api"
import { MessMenuAPI, type MessMenu, type DayOfWeek } from "./mess.api"

// ─── Types ────────────────────────────────────────────────────────────────────
type TabId = "menu" | "attendance" | "billing" | "feedback"

interface FeedbackForm {
  meal:    MealType | ""
  rating:  number
  comment: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getDayName(dateStr: string): DayOfWeek {
  return new Date(dateStr).toLocaleDateString("en-PK", { weekday:"long" }) as DayOfWeek
}

function fmt(n: number) {
  return n.toLocaleString("en-PK")
}

// ─── Config ───────────────────────────────────────────────────────────────────
const MEAL_ICON: Record<string, React.ReactNode> = {
  breakfast: <Coffee          size={16}/>,
  lunch:     <UtensilsCrossed size={16}/>,
  dinner:    <Moon            size={16}/>,
  Breakfast: <Coffee          size={16}/>,
  Lunch:     <UtensilsCrossed size={16}/>,
  Dinner:    <Moon            size={16}/>,
}

const MEAL_TIME: Record<string, string> = {
  breakfast:"7:00 – 9:00 AM",
  lunch:    "12:30 – 2:30 PM",
  dinner:   "7:00 – 9:00 PM",
}

const MEAL_COLOR: Record<string, string> = {
  breakfast:"#f59e0b", lunch:"var(--accent)", dinner:"#8b5cf6",
  Breakfast:"#f59e0b", Lunch:"var(--accent)", Dinner:"#8b5cf6",
}

const STATUS_CFG: Record<MealStatus, { color:string; bg:string; icon:React.ReactNode }> = {
  Present:{ color:"var(--green)", bg:"rgba(16,185,129,.12)", icon:<CheckCircle2 size={13}/> },
  Absent: { color:"var(--red)",   bg:"rgba(239,68,68,.12)",  icon:<XCircle      size={13}/> },
  Leave:  { color:"var(--amber)", bg:"rgba(245,158,11,.12)", icon:<Clock        size={13}/> },
}

// ─── Shared UI atoms ──────────────────────────────────────────────────────────
function Card({ title, icon, children, action }: {
  title:string; icon:React.ReactNode; children:React.ReactNode
  action?:{ label:string; onClick:()=>void }
}) {
  return (
    <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:20, overflow:"hidden" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"18px 22px", borderBottom:"1px solid var(--border)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:28, height:28, borderRadius:8, background:"var(--accent-lo)", color:"var(--accent)", display:"flex", alignItems:"center", justifyContent:"center" }}>{icon}</div>
          <span style={{ fontSize:14, fontWeight:700, color:"var(--text-pri)", fontFamily:"'DM Serif Display',serif" }}>{title}</span>
        </div>
        {action && (
          <button onClick={action.onClick} style={{ background:"none", border:"none", cursor:"pointer", fontSize:12, fontWeight:600, color:"var(--accent)", display:"flex", alignItems:"center", gap:4 }}>
            {action.label}<ChevronRight size={13}/>
          </button>
        )}
      </div>
      <div style={{ padding:"20px 22px" }}>{children}</div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width:"100%", padding:"10px 13px", borderRadius:11,
  border:"1.5px solid var(--border)", background:"var(--input-bg)",
  color:"var(--text-pri)", fontSize:13, outline:"none",
  transition:"border-color .2s", boxSizing:"border-box",
  fontFamily:"'DM Sans',sans-serif",
}
const labelStyle: React.CSSProperties = {
  fontSize:10, fontWeight:700, color:"var(--text-muted)",
  textTransform:"uppercase", letterSpacing:"0.07em", display:"block", marginBottom:5,
}

// ─── Tab: Menu ────────────────────────────────────────────────────────────────
function MenuTab({ token }: { token:string }) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0,10))
  const dayName = getDayName(selectedDate)

  const { data, isLoading } = useQuery({
    queryKey: ["student","mess-menu", dayName],
    queryFn:  () => fetch(
      `${(import.meta as any).env?.VITE_API_URL ?? "http://localhost:5000/api"}/student/mess-menu/${dayName}`,
      { headers:{ Authorization:`Bearer ${token}` } }
    ).then(r=>r.json()),
    staleTime: 30 * 60_000,
    enabled: !!token,
  })

  const menu: MessMenu | null = data?.data ?? null
  const meals = menu
    ? [
        { key:"breakfast", label:"Breakfast", meal:menu.breakfast },
        { key:"lunch",     label:"Lunch",     meal:menu.lunch     },
        { key:"dinner",    label:"Dinner",    meal:menu.dinner    },
      ]
    : []

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      {/* Date picker */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
        <div>
          <div style={{ fontSize:18, fontWeight:800, color:"var(--text-pri)", fontFamily:"'DM Serif Display',serif" }}>{dayName}'s Menu</div>
          <div style={{ fontSize:12, color:"var(--text-muted)", marginTop:2 }}>{selectedDate}</div>
        </div>
        <div style={{ position:"relative" }}>
          <Calendar size={13} color="var(--text-muted)" style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)" }}/>
          <input type="date" value={selectedDate} onChange={e=>setSelectedDate(e.target.value)}
            style={{ ...inputStyle, width:"auto", paddingLeft:34 }}
            onFocus={e=>(e.target.style.borderColor="var(--accent)")} onBlur={e=>(e.target.style.borderColor="var(--border)")}/>
        </div>
      </div>

      {/* Meal cards */}
      {isLoading ? (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
          {[1,2,3].map(i=><div key={i} style={{ height:200, background:"var(--border)", borderRadius:16, animation:"shimmer 1.4s ease-in-out infinite" }}/>)}
        </div>
      ) : !menu ? (
        <div style={{ textAlign:"center", padding:"48px 0", color:"var(--text-muted)" }}>
          <Utensils size={32} style={{ marginBottom:10, opacity:.3 }}/>
          <div style={{ fontSize:14, fontWeight:600 }}>No menu for {dayName}</div>
          <div style={{ fontSize:12, marginTop:4 }}>Check back later or contact the mess office</div>
        </div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:14 }}>
          {meals.map(({ key, label, meal }) => {
            const color = MEAL_COLOR[key]
            return (
              <div key={key} style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:16, overflow:"hidden" }}>
                {/* Meal header */}
                <div style={{ padding:"14px 18px", background:`color-mix(in srgb, ${color} 8%, var(--surface))`, borderBottom:"1px solid var(--border)" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                    <div style={{ width:28, height:28, borderRadius:8, background:`color-mix(in srgb, ${color} 15%, transparent)`, color, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      {MEAL_ICON[key]}
                    </div>
                    <span style={{ fontSize:14, fontWeight:800, color:"var(--text-pri)", fontFamily:"'DM Serif Display',serif" }}>{label}</span>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:"var(--text-muted)" }}>
                    <Clock size={11}/>{meal.startTime} – {meal.endTime}
                  </div>
                </div>
                {/* Items */}
                <div style={{ padding:"14px 18px" }}>
                  <div style={{ fontSize:10, fontWeight:700, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:10 }}>Menu Items</div>
                  <ul style={{ margin:0, padding:0, listStyle:"none", display:"flex", flexDirection:"column", gap:6 }}>
                    {meal.items.map((item, i) => (
                      <li key={i} style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, color:"var(--text-sec)" }}>
                        <span style={{ width:5, height:5, borderRadius:"50%", background:color, flexShrink:0 }}/>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Notes */}
      <div style={{ padding:"14px 18px", borderRadius:14, background:"rgba(245,158,11,.08)", border:"1px solid rgba(245,158,11,.2)", display:"flex", gap:10, alignItems:"flex-start" }}>
        <AlertTriangle size={15} color="var(--amber)" style={{ flexShrink:0, marginTop:1 }}/>
        <div style={{ fontSize:12, color:"var(--text-sec)", lineHeight:1.6 }}>
          <strong style={{ color:"var(--amber)" }}>Mess Rules:</strong> Meal timings are strict — latecomers may not be served.
          Special dietary requirements must be requested in advance. Wastage of food is strictly prohibited.
        </div>
      </div>
    </div>
  )
}

// ─── Tab: Attendance ─────────────────────────────────────────────────────────
function AttendanceTab({ token }: { token:string }) {
  const summaryQ = useQuery({
    queryKey: ["student","attendance","summary"],
    queryFn:  () => StudentAPI.getAttendanceSummary({}, token),
    staleTime:5*60_000, enabled:!!token,
  })

  const listQ = useQuery({
    queryKey: ["student","attendance","recent"],
    queryFn:  () => StudentAPI.getAttendance({ limit:30, sortOrder:"desc" }, token),
    staleTime:60_000, enabled:!!token,
  })

  const s       = summaryQ.data?.data
  const records = listQ.data?.data ?? []
  console.log(s);
  console.log(records);
  // Group records by date for the table view
  const byDate = useMemo(()=>{
    const map: Record<string, Record<MealType, MealStatus | null>> = {}
    records.forEach(r=>{
      const d = r.date.slice(0,10)
      if (!map[d]) map[d] = { Breakfast:null, Lunch:null, Dinner:null }
      map[d][r.mealType] = r.status
    })
    return Object.entries(map).slice(0,10)
  },[records])

  const pct = s?.attendancePct ?? 0

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      {/* Summary */}
      {s && (
        <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:18, padding:22 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
            <span style={{ fontSize:14, fontWeight:700, color:"var(--text-pri)" }}>Overall Attendance</span>
            <span style={{ fontSize:28, fontWeight:800, color:pct>=75?"var(--green)":"var(--red)", fontFamily:"'DM Serif Display',serif" }}>{pct}%</span>
          </div>
          <div style={{ height:8, borderRadius:4, background:"var(--border)", overflow:"hidden", marginBottom:14 }}>
            <div style={{ height:"100%", width:`${pct}%`, background:pct>=75?"var(--green)":"var(--red)", borderRadius:4, transition:"width .6s ease" }}/>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
            {[
              { l:"Total Meals",   v:s.totalMeals,  c:"var(--text-pri)"  },
              { l:"Present",       v:s.present,     c:"var(--green)"     },
              { l:"Absent",        v:s.absent,      c:"var(--red)"       },
              { l:"On Leave",      v:s.onLeave,     c:"var(--amber)"     },
            ].map(x=>(
              <div key={x.l} style={{ textAlign:"center", padding:10, background:"var(--surface)", borderRadius:12, border:"1px solid var(--border)" }}>
                <div style={{ fontSize:20, fontWeight:800, color:x.c, fontFamily:"'DM Serif Display',serif" }}>{x.v}</div>
                <div style={{ fontSize:10, fontWeight:700, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.06em", marginTop:2 }}>{x.l}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Per-meal breakdown */}
      {s?.byMeal && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
          {(["Breakfast","Lunch","Dinner"] as MealType[]).map(meal=>{
            const m = s.byMeal[meal]
            if (!m) return null
            const total = m.present+m.absent+m.onLeave
            const mp    = total>0?Math.round(m.present/total*100):0
            const color = MEAL_COLOR[meal]
            return (
              <div key={meal} style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:14, padding:16 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                  <span style={{ color }}>{MEAL_ICON[meal]}</span>
                  <span style={{ fontSize:13, fontWeight:700, color:"var(--text-sec)" }}>{meal}</span>
                </div>
                <div style={{ height:5, borderRadius:3, background:"var(--border)", overflow:"hidden", marginBottom:8 }}>
                  <div style={{ height:"100%", width:`${mp}%`, background:color, borderRadius:3, transition:"width .5s ease" }}/>
                </div>
                <div style={{ fontSize:18, fontWeight:800, color, fontFamily:"'DM Serif Display',serif" }}>{mp}%</div>
                <div style={{ fontSize:10, color:"var(--text-muted)", marginTop:2 }}>{m.present}/{total} meals</div>
              </div>
            )
          })}
        </div>
      )}

      {/* Table */}
      <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:18, overflow:"hidden" }}>
        <div style={{ padding:"14px 20px", borderBottom:"1px solid var(--border)", fontSize:13, fontWeight:700, color:"var(--text-pri)" }}>Recent Attendance</div>
        {/* Header */}
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr", gap:12, padding:"10px 20px", background:"var(--surface)", borderBottom:"1px solid var(--border)" }}>
          {["Date","Breakfast","Lunch","Dinner","Total"].map(h=>(
            <div key={h} style={{ fontSize:10, fontWeight:700, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.07em" }}>{h}</div>
          ))}
        </div>
        {byDate.length===0 ? (
          <div style={{ padding:"32px 20px", textAlign:"center", color:"var(--text-muted)", fontSize:13 }}>No attendance records yet</div>
        ) : byDate.map(([date, meals], i)=>{
          const total = Object.values(meals).filter(s=>s==="Present").length
          return (
            <div key={date} style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr", gap:12, padding:"11px 20px", borderBottom:i<byDate.length-1?"1px solid var(--border)":"none", alignItems:"center" }}>
              <div style={{ fontSize:12, color:"var(--text-sec)" }}>
                {new Date(date).toLocaleDateString("en-PK",{weekday:"short",day:"numeric",month:"short"})}
              </div>
              {(["Breakfast","Lunch","Dinner"] as MealType[]).map(meal=>{
                const st = meals[meal]
                const cfg = st ? STATUS_CFG[st] : null
                return (
                  <div key={meal}>
                    {cfg ? (
                      <span style={{ display:"inline-flex",alignItems:"center",justifyContent:"center",gap:4,padding:"3px 8px",borderRadius:20,fontSize:10,fontWeight:700,color:cfg.color,background:cfg.bg }}>
                        {cfg.icon}
                      </span>
                    ) : <span style={{ fontSize:11,color:"var(--text-muted)" }}>—</span>}
                  </div>
                )
              })}
              <div style={{ fontSize:13, fontWeight:700, color:total===3?"var(--green)":total===0?"var(--red)":"var(--amber)" }}>
                {total}/3
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Tab: Billing ─────────────────────────────────────────────────────────────
function BillingTab({ token }: { token:string }) {
  const summaryQ = useQuery({
    queryKey: ["student","invoices","summary"],
    queryFn:  () => StudentAPI.getInvoiceSummary(token),
    staleTime:5*60_000, enabled:!!token,
  })

  const subQ = useQuery({
    queryKey: ["student","subscription"],
    queryFn:  () => StudentAPI.getSubscription(token),
    staleTime:5*60_000, enabled:!!token,
  })

  const s   = summaryQ.data?.data
  const sub = subQ.data?.data

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      {/* Subscription info */}
      {sub && (
        <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:18, padding:22 }}>
          <div style={{ fontSize:13, fontWeight:700, color:"var(--text-pri)", marginBottom:14 }}>Current Subscription</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:10 }}>
            {[
              { l:"Plan",        v:sub.planType,                                            c:"var(--text-pri)" },
              { l:"Status",      v:sub.status,                                              c:sub.status==="Active"?"var(--green)":"var(--red)" },
              { l:"Monthly Fee", v:`PKR ${fmt(sub.monthlyFee)}`,                            c:"var(--accent)"   },
              { l:"Valid Until", v:sub.validUntil?new Date(sub.validUntil).toLocaleDateString("en-PK",{day:"numeric",month:"short",year:"numeric"}):"Indefinite", c:"var(--text-sec)" },
            ].map(f=>(
              <div key={f.l} style={{ padding:"12px 14px", background:"var(--surface)", borderRadius:12, border:"1px solid var(--border)" }}>
                <div style={{ fontSize:10, fontWeight:700, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:3 }}>{f.l}</div>
                <div style={{ fontSize:14, fontWeight:800, color:f.c, fontFamily:"'DM Serif Display',serif" }}>{f.v}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fee summary */}
      {s && (
        <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:18, padding:22 }}>
          <div style={{ fontSize:13, fontWeight:700, color:"var(--text-pri)", marginBottom:14 }}>Fee Summary</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:12 }}>
            {[
              { l:"Total Paid",    v:`PKR ${fmt(s.totalPaid)}`,        c:"var(--green)"  },
              { l:"Outstanding",   v:`PKR ${fmt(s.totalOutstanding)}`, c:s.totalOutstanding>0?"var(--red)":"var(--green)" },
              { l:"Overdue",       v:`${s.overdueCount} invoice${s.overdueCount!==1?"s":""}`, c:s.overdueCount>0?"var(--red)":"var(--green)" },
              { l:"Total Invoices",v:`${s.totalInvoices}`,             c:"var(--accent)" },
            ].map(f=>(
              <div key={f.l} style={{ padding:"14px 16px", background:"var(--surface)", borderRadius:12, border:"1px solid var(--border)" }}>
                <div style={{ fontSize:10, fontWeight:700, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:4 }}>{f.l}</div>
                <div style={{ fontSize:16, fontWeight:800, color:f.c, fontFamily:"'DM Serif Display',serif" }}>{f.v}</div>
              </div>
            ))}
          </div>
          {s.lastPaymentDate && (
            <div style={{ marginTop:14, fontSize:12, color:"var(--text-muted)" }}>
              Last payment: {new Date(s.lastPaymentDate).toLocaleDateString("en-PK",{day:"numeric",month:"long",year:"numeric"})}
            </div>
          )}
        </div>
      )}

      {!sub && !s && (
        <div style={{ textAlign:"center", padding:"48px 0", color:"var(--text-muted)" }}>
          <CreditCard size={32} style={{ marginBottom:10, opacity:.3 }}/>
          <div style={{ fontSize:14, fontWeight:600 }}>No billing information available</div>
        </div>
      )}
    </div>
  )
}

// ─── Tab: Feedback ────────────────────────────────────────────────────────────
function FeedbackTab({ token }: { token:string }) {
  const [form, setForm] = useState<FeedbackForm>({ meal:"", rating:0, comment:"" })
  const [hover, setHover] = useState(0)
  const [success, setSuccess] = useState(false)
  const [err, setErr] = useState<string|null>(null)

  // Note: complaint submit is the closest student-facing "feedback" mechanism
  // until a dedicated feedback endpoint is built. Shown as UI only for now.
  const handleSubmit = (e:FormEvent) => {
    e.preventDefault()
    if (!form.meal)   { setErr("Please select a meal."); return }
    if (!form.rating) { setErr("Please give a rating."); return }
    // TODO: POST /student/mess-feedback when endpoint is ready
    setSuccess(true)
    setTimeout(()=>setSuccess(false), 3000)
    setForm({ meal:"", rating:0, comment:"" })
    setErr(null)
  }

  const meals: MealType[] = ["Breakfast","Lunch","Dinner"]

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:20, padding:24 }}>
        <div style={{ fontSize:14, fontWeight:700, color:"var(--text-pri)", fontFamily:"'DM Serif Display',serif", marginBottom:20 }}>Submit Meal Feedback</div>
        <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:16, maxWidth:480 }}>
          {/* Meal selector */}
          <div>
            <label style={labelStyle}>Meal Type *</label>
            <div style={{ display:"flex", gap:8 }}>
              {meals.map(m=>{
                const active = form.meal===m
                const color  = MEAL_COLOR[m]
                return (
                  <button key={m} type="button" onClick={()=>setForm(p=>({...p,meal:m}))}
                    style={{ flex:1, padding:"10px 0", borderRadius:11, border:`1.5px solid ${active?color:"var(--border)"}`, background:active?`color-mix(in srgb, ${color} 10%, var(--input-bg))`:"var(--input-bg)", color:active?color:"var(--text-muted)", fontSize:12, fontWeight:active?700:500, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6, transition:"all .15s" }}>
                    <span style={{ color:active?color:"var(--text-muted)" }}>{MEAL_ICON[m]}</span>{m}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Star rating */}
          <div>
            <label style={labelStyle}>Rating *</label>
            <div style={{ display:"flex", gap:6 }}>
              {[1,2,3,4,5].map(star=>{
                const filled = star <= (hover || form.rating)
                return (
                  <button key={star} type="button"
                    onMouseEnter={()=>setHover(star)} onMouseLeave={()=>setHover(0)}
                    onClick={()=>setForm(p=>({...p,rating:star}))}
                    style={{ background:"none", border:"none", cursor:"pointer", padding:"4px", fontSize:24, color:filled?"#f59e0b":"var(--border)", transition:"color .15s, transform .1s", transform:hover===star?"scale(1.2)":"none" }}>
                    ★
                  </button>
                )
              })}
              {form.rating>0 && (
                <span style={{ fontSize:12, color:"var(--text-muted)", alignSelf:"center", marginLeft:4 }}>
                  {["","Poor","Fair","Good","Great","Excellent"][form.rating]}
                </span>
              )}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label style={labelStyle}>Comments</label>
            <textarea value={form.comment} onChange={e=>setForm(p=>({...p,comment:e.target.value}))} rows={4}
              placeholder="Share your thoughts about the meal quality, variety, or service…"
              style={{ ...inputStyle, resize:"vertical" }}
              onFocus={e=>(e.target.style.borderColor="var(--accent)")} onBlur={e=>(e.target.style.borderColor="var(--border)")}/>
          </div>

          {err && (
            <div style={{ display:"flex",alignItems:"center",gap:8,padding:"10px 14px",borderRadius:10,background:"rgba(239,68,68,.12)",color:"var(--red)",fontSize:12 }}>
              <AlertTriangle size={13}/>{err}
            </div>
          )}
          {success && (
            <div style={{ display:"flex",alignItems:"center",gap:8,padding:"10px 14px",borderRadius:10,background:"rgba(16,185,129,.12)",color:"var(--green)",fontSize:12 }}>
              <CheckCircle2 size={13}/>Feedback submitted! Thank you.
            </div>
          )}

          <button type="submit"
            style={{ padding:"10px 24px", borderRadius:12, border:"none", background:"var(--accent)", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", display:"flex",alignItems:"center",gap:8,alignSelf:"flex-start",boxShadow:"0 0 20px var(--accent-glow)" }}>
            <Send size={14}/>Submit Feedback
          </button>
        </form>
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const TABS: { id:TabId; label:string; icon:React.ReactNode }[] = [
  { id:"menu",       label:"Today's Menu",  icon:<Utensils     size={15}/> },
  { id:"attendance", label:"Attendance",    icon:<ClipboardList size={15}/> },
  { id:"billing",    label:"Mess Bill",     icon:<CreditCard   size={15}/> },
  { id:"feedback",   label:"Feedback",      icon:<Star         size={15}/> },
]

const Mess: React.FC = () => {
  const { token }   = useCustom() as { token:string }
  const [active, setActive] = useState<TabId>("menu")

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", color:"var(--text-pri)", display:"flex", flexDirection:"column", gap:24 }}>

      {/* Header */}
      <div>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:"var(--green)", boxShadow:"0 0 8px var(--green)" }}/>
          <span style={{ fontSize:10, fontWeight:700, color:"var(--green)", textTransform:"uppercase", letterSpacing:"0.1em" }}>Mess Management</span>
        </div>
        <h1 style={{ margin:0, fontSize:26, fontWeight:800, color:"var(--text-pri)", fontFamily:"'DM Serif Display',serif" }}>Mess Portal</h1>
        <p style={{ margin:"5px 0 0", fontSize:13, color:"var(--text-muted)" }}>View menu, track attendance, check billing, and submit feedback</p>
      </div>

      {/* Tab bar */}
      <div style={{ display:"flex", gap:4, background:"var(--surface)", padding:4, borderRadius:14, border:"1px solid var(--border)", overflowX:"auto" }}>
        {TABS.map(tab=>{
          const isActive = active===tab.id
          return (
            <button key={tab.id} onClick={()=>setActive(tab.id)}
              style={{ display:"flex",alignItems:"center",gap:7,padding:"9px 16px",borderRadius:10,border:"none",background:isActive?"var(--card)":"transparent",color:isActive?"var(--accent)":"var(--text-muted)",fontSize:13,fontWeight:isActive?700:500,cursor:"pointer",whiteSpace:"nowrap",transition:"all .2s",boxShadow:isActive?"0 2px 8px rgba(0,0,0,.15)":"none",flexShrink:0 }}>
              <span style={{ color:isActive?"var(--accent)":"var(--text-muted)" }}>{tab.icon}</span>
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      <div style={{ animation:"fadeUp .2s ease" }}>
        {active==="menu"       && <MenuTab       token={token}/>}
        {active==="attendance" && <AttendanceTab token={token}/>}
        {active==="billing"    && <BillingTab    token={token}/>}
        {active==="feedback"   && <FeedbackTab   token={token}/>}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes shimmer { 0%,100%{opacity:.4} 50%{opacity:.8} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        select option { background:var(--card); color:var(--text-pri); }
      `}</style>
    </div>
  )
}

export default Mess