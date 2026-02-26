import Logo from "@/components/drama/logo"
import UserAvatar from "@/components/drama/user-avatar"
import { ModeToggle } from "@/components/mode-toggle"

import Link from "next/link"
import { NavCategories } from "@/constants/nav-categories"
import GlobalSearch from "./global-search"

export default function DramaHeader() {
  return (
    <header className="flex items-center w-full h-16 sticky top-0 z-50 bg-background/80 backdrop-blur-md px-4 md:px-10 border-b">
      <div className="flex items-center gap-8 flex-1">
        <Logo />
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          {NavCategories.map((category) => (
            <Link key={category.title} href={category.href} className="transition-colors hover:text-primary">
              {category.title}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-5">
        <GlobalSearch />
        <div className="flex items-center gap-4">
          <ModeToggle />
          <UserAvatar />
        </div>
      </div>
    </header>
  )
}
