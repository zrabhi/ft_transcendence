import React from 'react'

interface User {
  username: string;
  avatar: string;
}

interface FriendsDataProps {
  friends: User[];
}

export default function FriendsData({friends}: FriendsDataProps) {
  return (
    <div>FriendsData</div>
  )
}
