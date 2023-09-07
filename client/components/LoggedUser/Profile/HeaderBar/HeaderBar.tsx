import React from 'react'
import SearchBar from '@/components/LoggedUser/Profile/HeaderBar/SearchBar/SearchBar'
import Notification from '@/components/LoggedUser/Profile/HeaderBar/Notification/Notification'
import './HeaderBar.scss'

export default function HeaderBar() {
  return (
    <div className="header-bar">
      <div className="header-bar__title">
        <h1>Welocme Back</h1>
      </div>
      <div className="header-icons">
        <SearchBar />
        <Notification />
      </div>
    </div>
  )
}
