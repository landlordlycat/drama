"use client"

import Logo from "@/components/drama/logo"
import UserAvatar from "@/components/drama/user-avatar"
import { ModeToggle } from "@/components/mode-toggle"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { NavCategories } from "@/constants/nav-categories"
import GlobalSearch from "./global-search"
import { Home, LayoutGrid, Flame } from "lucide-react"

const navIcons = {
  首页: Home,
  分类: LayoutGrid,
  热门: Flame,
}

export default function DramaHeader() {
  const pathname = usePathname()

  return (
    <>
      <header className="flex items-center w-full h-16 sticky top-0 z-50 bg-background/80 backdrop-blur-md px-4 md:px-10 border-b">
        <div className="flex items-center gap-8 flex-1">
          <Logo />
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
            {NavCategories.map((category) => {
              const isActive = pathname === category.href || (category.href !== "/" && pathname.startsWith(category.href))
              return (
                <Link
                  key={category.title}
                  href={category.href}
                  className={`transition-colors ${isActive ? "text-primary font-semibold" : "hover:text-primary"}`}
                >
                  {category.title}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-5">
          <GlobalSearch />
          <ModeToggle />
          <UserAvatar />
        </div>
      </header>

      {/* 移动端底部导航 */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t md:hidden safe-area-inset-bottom">
        <div className="flex items-center justify-around h-14">
          {NavCategories.map((category) => {
            const Icon = navIcons[category.title as keyof typeof navIcons]
            const isActive = pathname === category.href || (category.href !== "/" && pathname.startsWith(category.href))
            return (
              <Link
                key={category.title}
                href={category.href}
                className={`flex flex-col items-center justify-center gap-1 px-4 py-1 transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`}
              >
                {Icon && <Icon className="h-5 w-5" />}
                <span className="text-xs font-medium">{category.title}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
