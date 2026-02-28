"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogOutIcon, UserIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { signOut, useSession } from "@/lib/auth-client"
import { writeAuthLog } from "@/lib/auth-log-client"

export default function UserAvatar() {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const router = useRouter()

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        {session ? (
          <Button variant="ghost" size="icon" className="rounded-full">
            <Avatar className="cursor-pointer">
              <AvatarImage className="object-cover" src={session.user.image || "https://github.com/evilrabbit.png"} alt="@evilrabbit" />
              <AvatarFallback>登录</AvatarFallback>
            </Avatar>
          </Button>
        ) : (
          <Link href="/sign-in">
            <Avatar className="cursor-pointer">
              <AvatarFallback>登录</AvatarFallback>
            </Avatar>
          </Link>
        )}
      </DropdownMenuTrigger>

      {session && (
        <DropdownMenuContent>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault()
              setOpen(false)
              router.push("/dashboard")
            }}
          >
            <UserIcon />
            后台管理
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onSelect={async (e) => {
              e.preventDefault()
              await writeAuthLog({
                operation: "LOGOUT",
                content: "前台用户主动退出",
                result: "SUCCESS",
                fallbackUserName: session.user.email,
              })
              signOut()
            }}
          >
            <LogOutIcon />
            退出登录
          </DropdownMenuItem>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  )
}
