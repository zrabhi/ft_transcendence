import React from 'react'
import Image from 'next/image'
import NotifFriendRequest from './NotifFriendRequest'
import NotifMessage from './NotifMessage'
import NotifGameRequest from './NotifGameRequest'

export default function NotifItem({ data }: any) {
  return (
    <div className='notif-item p-2 mb-1 rounded bg-purple-50 bg-opacity-30 hover:bg-opacity-50
      flex justify-between items-center gap-4 cursor-pointer transition-all duration-200 ease-in-out
    '>
      <div className="avatar rounded-full overflow-hidden w-16">
        <Image 
          src={data.avatar} 
          alt="avatar"
          width={100}
          height={100}
        />
      </div>
      <div className="content grow text-slate-900">
        {
          // instead of pass the data to the component we can pass only username and content
          data.type === 1 ? (
            <NotifFriendRequest data={data} />
          ) : data.type === 2 ? (
            <NotifMessage data={data} />
          ) : (
            <NotifGameRequest data={data} />
          )
        }
      </div>
    </div>
  )
}
