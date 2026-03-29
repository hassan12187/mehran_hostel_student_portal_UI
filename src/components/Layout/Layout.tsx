// src/components/Layout/Layout.tsx
import React, { useState } from "react"
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import {
  LayoutDashboard, CreditCard, AlertCircle,
  CalendarDays, User, UtensilsCrossed,
  Settings, LogOut, Building, Menu, X, Bell,
  ChevronRight,
} from "lucide-react"
import { useCustom } from "../../context/Store"
// import { logout }    from "../../services/auth.service"
import { useQuery }  from "@tanstack/react-query"
import { StudentAPI } from "../../services/student.api"
import Axios from "../Reusable/Axios"

const NAV = [
  { path: "/",            label: "Dashboard",    icon: <LayoutDashboard size={16}/>, end: true  },
  { path: "/invoices",    label: "Invoices",     icon: <CreditCard      size={16}/>, end: false },
  { path: "/complaints",  label: "Complaints",   icon: <AlertCircle     size={16}/>, end: false },
  { path: "/attendance",  label: "Attendance",   icon: <CalendarDays    size={16}/>, end: false },
  { path: "/mess",label: "Mess",         icon: <UtensilsCrossed size={16}/>, end: false },
  { path: "/profile",     label: "Profile",      icon: <User            size={16}/>, end: false },
  { path: "/settings",    label: "Settings",     icon: <Settings        size={16}/>, end: false },
]

export default function Layout() {
  const { token, setToken } = useCustom() as { token:string; setToken:(t:string|null)=>void }
  const navigate            = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const { data } = useQuery({
    queryKey:  ["student","dashboard"],
    queryFn:   () => StudentAPI.getDashboard(token),
    staleTime: 2 * 60_000,
    enabled:   !!token,
  })

  const name = data?.data?.profile?.student_name ?? "Student"
  const logout=async()=>{
    const result = await Axios.post("/auth/logout",{},{
      withCredentials:true,
      headers:{
        Authorization:`Bearer ${token}`
      }
    });
  };
  const handleLogout = async () => {
    await logout()
    setToken(null)
    navigate("/login")
  }

  const initials = name.split(" ").slice(0,2).map((w:string)=>w[0]).join("").toUpperCase()
  const hue      = name.split("").reduce((a:number,c:string)=>a+c.charCodeAt(0),0) % 360

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"var(--bg)", fontFamily:"'DM Sans',sans-serif" }}>

      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? 220 : 0,
        minWidth: sidebarOpen ? 220 : 0,
        background: "var(--surface)", borderRight: "1px solid var(--border)",
        display: "flex", flexDirection: "column",
        overflow: "hidden", transition: "width .25s ease, min-width .25s ease",
        flexShrink: 0, position: "relative",
      }}>
        {/* Logo */}
        <div style={{ padding:"20px 16px 16px", borderBottom:"1px solid var(--border)", display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
          <div style={{ width:34, height:34, borderRadius:10, background:"var(--accent-lo)", border:"1px solid rgba(99,102,241,.3)", color:"var(--accent)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 14px rgba(99,102,241,.2)", flexShrink:0 }}>
            <Building size={17}/>
          </div>
          <div>
            <div style={{ fontSize:13, fontWeight:800, color:"var(--text-pri)", fontFamily:"'DM Serif Display',serif", whiteSpace:"nowrap" }}>HostelMS</div>
            <div style={{ fontSize:10, color:"var(--text-muted)", fontWeight:500 }}>Student Portal</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, overflowY:"auto", padding:"10px 0" }}>
          {NAV.map(item => (
            <NavLink key={item.path} to={item.path} end={item.end}
              style={({ isActive }) => ({
                display:"flex", alignItems:"center", gap:10,
                padding:"9px 16px", margin:"1px 8px",
                borderRadius:10, textDecoration:"none",
                fontSize:13,
                fontWeight:     isActive ? 700 : 500,
                color:          isActive ? "var(--accent)" : "var(--text-muted)",
                background:     isActive ? "var(--accent-lo)" : "transparent",
                borderLeft:     isActive ? "3px solid var(--accent)" : "3px solid transparent",
                transition:     "all .15s",
              })}
            >
              {({ isActive }) => (
                <>
                  <span style={{ color: isActive ? "var(--accent)" : "var(--text-muted)", flexShrink:0, display:"flex" }}>{item.icon}</span>
                  <span style={{ whiteSpace:"nowrap" }}>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User + Logout */}
        <div style={{ padding:"12px 8px", borderTop:"1px solid var(--border)", flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 10px", marginBottom:4 }}>
            <div style={{ width:30, height:30, borderRadius:9, background:`hsl(${hue},45%,30%)`, color:`hsl(${hue},80%,85%)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, flexShrink:0 }}>
              {initials}
            </div>
            <div style={{ minWidth:0 }}>
              <div style={{ fontSize:12, fontWeight:700, color:"var(--text-pri)", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{name}</div>
              <div style={{ fontSize:10, color:"var(--text-muted)" }}>Student</div>
            </div>
          </div>
          <button onClick={handleLogout}
            style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"9px 12px", borderRadius:10, border:"none", background:"transparent", color:"var(--red)", fontSize:13, fontWeight:600, cursor:"pointer", transition:"background .15s" }}
            onMouseEnter={e=>((e.currentTarget as HTMLButtonElement).style.background="rgba(239,68,68,.08)")}
            onMouseLeave={e=>((e.currentTarget as HTMLButtonElement).style.background="transparent")}
          >
            <LogOut size={15} style={{ flexShrink:0 }}/> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>
        {/* Header */}
        <header style={{ background:"var(--surface)", borderBottom:"1px solid var(--border)", position:"sticky", top:0, zIndex:100, flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", padding:"0 24px", height:60, gap:16 }}>
            <button onClick={()=>setSidebarOpen(p=>!p)}
              style={{ width:36, height:36, borderRadius:10, border:"1px solid var(--border)", background:"transparent", color:"var(--text-sec)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"all .2s", flexShrink:0 }}
              onMouseEnter={e=>{const el=e.currentTarget as HTMLButtonElement;el.style.background="var(--accent-lo)";el.style.color="var(--accent)";el.style.borderColor="var(--accent)"}}
              onMouseLeave={e=>{const el=e.currentTarget as HTMLButtonElement;el.style.background="transparent";el.style.color="var(--text-sec)";el.style.borderColor="var(--border)"}}
            >
              <Menu size={17}/>
            </button>
            <span style={{ fontSize:15, fontWeight:700, color:"var(--text-pri)", flex:1, fontFamily:"'DM Sans',sans-serif" }}>
              Student Portal
            </span>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex:1, padding:"28px 32px", overflowY:"auto" }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
        :root {
          --bg:#0f1117; --surface:#13161e; --card:#181c25; --card-hover:rgba(255,255,255,.03);
          --border:rgba(255,255,255,.08); --border-hover:rgba(255,255,255,.14);
          --accent:#6366f1; --accent-lo:rgba(99,102,241,.1); --accent-glow:rgba(99,102,241,.4);
          --green:#10b981; --amber:#f59e0b; --red:#ef4444;
          --text-pri:#f1f5f9; --text-sec:#94a3b8; --text-muted:#475569;
          --input-bg:#1e2230; --overlay:rgba(0,0,0,.6); --shadow:0 24px 48px rgba(0,0,0,.4);
          --stat-shadow:0 8px 32px rgba(99,102,241,.2);
        }
      `}</style>
    </div>
  )
}