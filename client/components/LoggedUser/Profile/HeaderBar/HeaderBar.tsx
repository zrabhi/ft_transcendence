import React from 'react'
import { IoMdSearch } from 'react-icons/io'
import { BsBellFill } from 'react-icons/Bs'
import './HeaderBar.scss'
import PopUpModal from '@/components/LoggedUser/Profile/PopUpModal/PopUpModal'
import SearchContent from './SearchContent'
import NotifContent from './NotifContent'

export default function HeaderBar() {

  const [showSearchModal, setShowSearchModal] = React.useState(false)
  const [showNotifModal, setShowNotifModal] = React.useState(false)

  return (
    <div className="header-bar">
      <div className="title">
        <h1 className='text-white'>Welocme Back</h1>
      </div>
      <div className="icons">
        <IoMdSearch className="icon" onClick={() => setShowSearchModal(true)} />
        <BsBellFill className="icon" onClick={() => setShowNotifModal(true)} />
        <PopUpModal isVisible={showSearchModal} close={() => setShowSearchModal(false)}>
          <SearchContent />
        </PopUpModal>
        <PopUpModal isVisible={showNotifModal} close={() => setShowNotifModal(false)}>
          <NotifContent />
        </PopUpModal>
      </div>
    </div>
  )
}
