"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, LogOutIcon, SquareKanban, UserCog } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { authClient, useSession } from "@/lib/auth-client"
import { writeAuthLog } from "@/lib/auth-log-client"

export function UserDropdown() {
  const [open, setOpen] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="default" className="flex items-center gap-2">
          <Avatar className="size-8">
            <AvatarImage src={session?.user.image || "https://github.com/evilrabbit.png"} className="object-cover" />
            <AvatarFallback>用户</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{session?.user.name || "Biscuit"}</span>
          <ChevronDown className={`size-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => router.push("/dashboard")}>
          <SquareKanban />
          概览
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => router.push("/dashboard/profile")}>
          <UserCog />
          个人设置
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onSelect={async () => {
            await writeAuthLog({
              operation: "LOGOUT",
              content: "后台用户主动退出",
              result: "SUCCESS",
              fallbackUserName: session?.user.email,
            })
            authClient.signOut()
            router.replace("/")
          }}
        >
          <LogOutIcon />
          退出登录
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
