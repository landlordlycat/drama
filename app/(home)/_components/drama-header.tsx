import Logo from "@/components/drama/logo"
import UserAvatar from "@/components/drama/user-avatar"
import { ModeToggle } from "@/components/mode-toggle"
import { Search, Bell } from "lucide-react"
import Link from "next/link"
import { NavCategories } from "@/constants/nav-categories"
export default function DramaHeader() {
  return (
    <header className="flex items-center w-full h-16  sticky top-0 z-50 bg-background/80 backdrop-blur-md">
      <Logo />
      <div className="flex items-center gap-7 ml-6 text-xl">
        {NavCategories.map((category) => (
          <Link key={category.title} href={category.href}>
            {category.title}
          </Link>
        ))}
      </div>
      <div className="flex flex-row items-center ml-auto gap-5">
        <Search />
        <Bell />
        <ModeToggle />
        <UserAvatar />
      </div>
    </header>
  )
}
