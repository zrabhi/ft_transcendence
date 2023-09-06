import React from 'react'
import SearchBar from '@/components/LoggedUser/Profile/HeaderBar/SearchBar/SearchBar'
import Notifications from '@/components/LoggedUser/Profile/HeaderBar/Notifications/Notifications'
import './HeaderBar.scss'

export default function HeaderBar() {
  return (
    <div className="header-bar">
      <SearchBar />
      <Notifications />
    </div>
  )
}
