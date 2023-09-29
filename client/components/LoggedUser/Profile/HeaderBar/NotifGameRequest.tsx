import React from 'react'

export default function NotifGameRequest({data}: any) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold">{data.username}</span>
      <span className="text-sm font-semibold">You have a game request from</span>
    </div>
  )
}
