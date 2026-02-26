import React from "react"
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
export default function UserAvatar() {
  return (
    <Avatar>
      <AvatarImage src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
      <AvatarFallback>CN</AvatarFallback>
      {/* <AvatarBadge className="bg-green-600 dark:bg-green-800" /> */}
    </Avatar>
  )
}
