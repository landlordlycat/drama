import React from "react"
import Image from "next/image"
export default function Logo() {
  return <Image loading="eager" src="/vercel.svg" width={126} height={32} alt="logo" className="bg-slate-500 h-[32px]" />
}
