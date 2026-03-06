import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { requireAdmin } from "@/lib/auth/admin"

export default async function AdminInnerLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  await requireAdmin(locale)

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
