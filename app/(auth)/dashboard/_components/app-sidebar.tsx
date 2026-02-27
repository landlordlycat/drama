"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail } from "@/components/ui/sidebar"
import { LayoutDashboard, Users, Settings, EqualApproximatelyIcon, Mail, Cat, UserRoundCog } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSession } from "@/lib/auth-client"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

const menuItems = [
  {
    title: "概览",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "用户",
    url: "/dashboard/users",
    icon: UserRoundCog,
  },
  {
    title: "设置",
    url: "/dashboard/profile",
    icon: Settings,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { data: session } = useSession()
  console.log(session)
  return (
    <Sidebar collapsible="icon" {...props}>
      {/* header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <LayoutDashboard className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Dashboard</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <Separator className="bg-black/3" />
      </SidebarHeader>

      {/* content */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>常用</SidebarGroupLabel>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* footer */}
      <SidebarFooter className="group-data-[collapsible=icon]:hidden">
        <SidebarMenu>
          <SidebarMenuItem>
            <Separator className="bg-black/5" />
            <div className="flex items-center text-gray-500 px-2 py-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>{session?.user.name || "Biscuit"}</span>
                </TooltipTrigger>
                <TooltipContent>
                  <span>{session?.user.email || "Biscuit"}</span>
                </TooltipContent>
              </Tooltip>
              <div className="flex ml-auto">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onAbort={() => {
                    // mailto:xxxx@qq.com
                  }}
                >
                  <Mail />
                </Button>
                <Button variant="ghost" size="icon-sm">
                  <Cat />
                </Button>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      {/* rail */}
      <SidebarRail />
    </Sidebar>
  )
}
