import React from "react"

export default async function Dramas({
  params,
}: {
  params: Promise<{
    id: string
  }>
}) {
  const { id } = await params
  return <div>Drama-{id}</div>
}
