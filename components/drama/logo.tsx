import React from "react"
import Image from "next/image"
export default function Logo() {
  return <Image loading="eager" src="/logo.svg" width={126} height={32} alt="logo" className="h-[32px] w-auto" />
}
