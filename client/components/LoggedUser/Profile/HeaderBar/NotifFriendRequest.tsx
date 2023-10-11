import { useRouter } from 'next/navigation'
import React from 'react'

export default function NotifFriendRequest({data}: any) {
  const router = useRouter();
  const handleRedirectProfile = () =>
  {
    router.push(`/profile/${data.username}`);
  }
  return (
    <div className="flex flex-col gap-2" onClick={handleRedirectProfile}>
      <span className="text-sm font-semibold">{data.username}</span>
      <span className="text-sm font-semibold">You have a friend request from this user</span>
    </div>
  )
}
