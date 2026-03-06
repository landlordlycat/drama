"use client"

import { usePathname } from "next/navigation"

export default function ModalSlot({ modal }: { modal: React.ReactNode }) {
  const pathname = usePathname()

  if (pathname.startsWith("/detail/")) {
    return null
  }

  return <>{modal}</>
}
