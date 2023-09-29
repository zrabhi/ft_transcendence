import React from 'react'
import Image from 'next/image'

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
      <div className="content bg-slate-600 grow">
        <p>hello this is content</p>
      </div>
    </div>
  )
}
