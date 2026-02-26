import Logo from "@/components/drama/logo"
import UserAvatar from "@/components/drama/user-avatar"
import { ModeToggle } from "@/components/mode-toggle"
import { Search, Bell } from "lucide-react"
import Link from "next/link"
import { NavCategories } from "@/constants/nav-categories"

export default function DramaHeader() {
  return (
    <header className="flex items-center w-full h-16 sticky top-0 z-50 bg-background/80 backdrop-blur-md px-4 md:px-10 border-b">
      <div className="flex items-center gap-8 flex-1">
        <Logo />
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          {NavCategories.map((category) => (
            <Link 
              key={category.title} 
              href={category.href}
              className="transition-colors hover:text-primary"
            >
              {category.title}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-5">
        <div className="hidden sm:flex items-center bg-muted px-3 py-1.5 rounded-full gap-2 text-muted-foreground cursor-pointer hover:bg-muted/80 transition-colors">
          <Search className="w-4 h-4" />
          <span className="text-xs pr-8">搜索影片...</span>
        </div>
        <div className="flex items-center gap-4">
          <Bell className="w-5 h-5 cursor-pointer hover:text-primary transition-colors" />
          <ModeToggle />
          <UserAvatar />
        </div>
      </div>
    </header>
  )
}
