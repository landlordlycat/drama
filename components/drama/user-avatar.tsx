"use client"

import React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { useAuth } from "@/components/auth-provider"
import Link from "next/link"

export default function UserAvatar() {
  return (
    <Link href="/user/login">
      <Avatar className="cursor-pointer">
        <AvatarImage src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
        <AvatarFallback>登录</AvatarFallback>
      </Avatar>
    </Link>
  )
}
