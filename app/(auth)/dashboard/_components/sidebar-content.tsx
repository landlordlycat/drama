import { SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { FileChartColumn, History, LayoutDashboard, LibraryBig, LucideIcon, MonitorPlay, Settings, Shapes } from "lucide-react"
import Link from "next/link"

interface MenuItem {
  title: string
  url: string
  icon: LucideIcon
}

interface MenuGroup {
  title: string
  children: MenuItem[]
}

const menuGroups: MenuGroup[] = [
  {
    title: "常用",
    children: [
      {
        title: "概览",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "分类管理",
        url: "/dashboard/categories",
        icon: Shapes,
      },
      {
        title: "播放源",
        url: "/dashboard/sources",
        icon: MonitorPlay,
      },
      {
        title: "收藏夹",
        url: "/dashboard/collect",
        icon: LibraryBig,
      },
      {
        title: "历史记录",
        url: "/dashboard/history",
        icon: History,
      },
    ],
  },
  {
    title: "系统",
    children: [
      {
        title: "设置",
        url: "/dashboard/profile",
        icon: Settings,
      },
      {
        title: "日志",
        icon: FileChartColumn,
        url: "/dashboard/logs",
      },
    ],
  },
]
export default function ASidebarContent({ pathname }: { pathname: string }) {
  return (
    <SidebarContent>
      {menuGroups.map((group) => (
        <SidebarGroup key={group.title}>
          <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
          <SidebarMenu>
            {group.children.map((item) => (
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
      ))}
    </SidebarContent>
  )
}
