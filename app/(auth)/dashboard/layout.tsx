"use client"

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./_components/app-sidebar"
import { UserDropdown } from "./_components/user-dropdown"
import { ModeToggle } from "@/components/mode-toggle"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* header */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b px-4">
          <SidebarTrigger className="size-10" />
          <div className="flex items-center gap-1">
            <ModeToggle />
            <UserDropdown />
          </div>
        </header>
        {/* content */}
        <div className="bg-muted/50 h-full p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}