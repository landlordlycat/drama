import React from "react"
import Image from "next/image"
import Link from "next/link"

export default function Logo() {
  return (
    <Link href="/">
      <Image loading="eager" src="/logo.svg" width={126} height={32} alt="logo" className="h-[32px] w-auto" />
    </Link>
  )
}
