import React from 'react'
import './style.scss'
import SideBar from '@/components/SideBar/SideBar'

export default function Profile() {
  return (
    <div className="profile-page text-white">
      <SideBar />
      <div className="profile">
        profile
      </div>
    </div>
  )
}
