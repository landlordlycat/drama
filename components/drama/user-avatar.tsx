"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSession, signOut } from "@/lib/auth-client"
// import { useAuth } from "@/components/auth-provider"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"

import { LogOutIcon, UserIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "../ui/button"
import { useState } from "react"

export default function UserAvatar() {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const router = useRouter()

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          {session ?
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="cursor-pointer">
                <AvatarImage className="object-cover" src={session?.user.image || "https://github.com/evilrabbit.png"} alt="@evilrabbit" />
                <AvatarFallback>登录</AvatarFallback>
              </Avatar>
            </Button>
          : <Link href="/sign-in">
              <Avatar className="cursor-pointer">
                <AvatarFallback>登录</AvatarFallback>
              </Avatar>
            </Link>
          }
        </DropdownMenuTrigger>
        {session && (
          <DropdownMenuContent>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault()
                // 关闭下拉菜单
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
              onSelect={(e) => {
                e.preventDefault()
                signOut()
              }}
            >
              <LogOutIcon />
              退出登录
            </DropdownMenuItem>
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    </>
  )
}
