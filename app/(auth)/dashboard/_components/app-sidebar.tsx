"use client"

import { usePathname } from "next/navigation"
import { Sidebar, SidebarRail } from "@/components/ui/sidebar"
import { useSession } from "@/lib/auth-client"
import ASidebarHeader from "./sidebar-header"
import ASidebarFooter from "./sidebar-footer"
import ASidebarContent from "./sidebar-content"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* header */}
      <ASidebarHeader />

      {/* content */}
      <ASidebarContent pathname={pathname} />

      {/* footer */}
      <ASidebarFooter session={session} />

      {/* rail */}
      <SidebarRail />
    </Sidebar>
  )
}
