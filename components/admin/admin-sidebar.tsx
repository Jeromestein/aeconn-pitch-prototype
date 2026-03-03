"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Megaphone,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
} from "lucide-react"
import { useState } from "react"

const ADMIN_BASE_PATH = "/internal/console"
const DASHBOARD_PATH = `${ADMIN_BASE_PATH}/dashboard`

const navItems = [
  { href: DASHBOARD_PATH, label: "Dashboard", labelZh: "数据概览", icon: LayoutDashboard },
  { href: `${ADMIN_BASE_PATH}/contacts`, label: "Contacts", labelZh: "客户管理", icon: Users },
  { href: `${ADMIN_BASE_PATH}/visits`, label: "Visits", labelZh: "签到流水", icon: ClipboardList },
  { href: `${ADMIN_BASE_PATH}/campaigns`, label: "Campaigns", labelZh: "营销活动", icon: Megaphone },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const sidebar = (
    <div
      className={`flex h-full flex-col border-r border-border/50 bg-sidebar transition-all duration-300 ${
        collapsed ? "w-[72px]" : "w-[260px]"
      }`}
    >
        {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-border/50 px-4">
        {!collapsed && (
          <Link href={DASHBOARD_PATH} className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/30 bg-background">
              <span className="text-base font-bold text-primary">A</span>
            </div>
            <span className="text-base font-semibold text-foreground">Aeconn</span>
          </Link>
        )}
        {collapsed && (
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg border border-primary/30 bg-background">
            <span className="text-base font-bold text-primary">A</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:block"
        >
          <ChevronLeft
            className={`h-4 w-4 transition-transform ${collapsed ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3">
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== DASHBOARD_PATH && pathname.startsWith(item.href))
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <item.icon className={`h-5 w-5 flex-shrink-0 ${isActive ? "text-primary" : ""}`} />
                  {!collapsed && (
                    <div className="flex flex-col">
                      <span>{item.label}</span>
                      <span className="text-xs opacity-50">{item.labelZh}</span>
                    </div>
                  )}
                  {isActive && !collapsed && (
                    <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-border/50 p-3">
        <Link
          href={ADMIN_BASE_PATH}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </Link>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block">{sidebar}</aside>

      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed left-4 top-4 z-50 rounded-lg border border-border bg-surface-1 p-2 text-foreground lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 lg:hidden">{sidebar}</aside>
        </>
      )}
    </>
  )
}
