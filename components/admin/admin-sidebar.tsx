"use client"

import {Link, usePathname} from "@/i18n/navigation"
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Megaphone,
  ChevronLeft,
  Menu,
} from "lucide-react"
import {useState} from "react"
import {useTranslations} from "next-intl"
import {SignOutButton} from "@/components/admin/sign-out-button"

const ADMIN_BASE_PATH = "/internal"
const DASHBOARD_PATH = `${ADMIN_BASE_PATH}/dashboard`

const navItems = [
  {href: DASHBOARD_PATH, labelKey: "dashboard", icon: LayoutDashboard},
  {href: `${ADMIN_BASE_PATH}/contacts`, labelKey: "contacts", icon: Users},
  {href: `${ADMIN_BASE_PATH}/visits`, labelKey: "visits", icon: ClipboardList},
  {href: `${ADMIN_BASE_PATH}/campaigns`, labelKey: "campaigns", icon: Megaphone},
] as const

export function AdminSidebar() {
  const t = useTranslations("adminSidebar")
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const sidebar = (
    <div
      className={`flex h-full flex-col border-r border-border/50 bg-sidebar transition-all duration-300 ${
        collapsed ? "w-[72px]" : "w-[260px]"
      }`}
    >
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
          <ChevronLeft className={`h-4 w-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
        </button>
      </div>

      <nav className="flex-1 p-3">
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== DASHBOARD_PATH && pathname.startsWith(item.href))
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
                  {!collapsed && <span>{t(item.labelKey)}</span>}
                  {isActive && !collapsed && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="border-t border-border/50 p-3">
        <SignOutButton
          collapsed={collapsed}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-60"
        />
      </div>
    </div>
  )

  return (
    <>
      <aside className="hidden lg:block">{sidebar}</aside>

      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed left-4 top-4 z-50 rounded-lg border border-border bg-surface-1 p-2 text-foreground lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

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
