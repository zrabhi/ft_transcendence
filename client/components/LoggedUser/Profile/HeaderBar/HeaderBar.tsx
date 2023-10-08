import React from 'react'
import { IoMdSearch } from 'react-icons/io'
import { BsBellFill } from 'react-icons/Bs'
import './HeaderBar.scss'
import PopUpModal from '@/components/LoggedUser/Profile/PopUpModal/PopUpModal'
import SearchContent from './SearchContent'
import NotifContent from './NotifContent'

export default function HeaderBar({data}: any) {

  const [showSearchModal, setShowSearchModal] = React.useState(false)
  const [showNotifModal, setShowNotifModal] = React.useState(false)
  
  return (
    <div className="header-bar">
      <div className="title">
        <h3 className='text-white font-semibold text-xs'>
          Welocme Back
          <span className='mx-2 font-semibold text-xs italic '>{data.username}</span>
        </h3>
      </div>
      <div className="icons">
        <IoMdSearch className="icon text-white" onClick={() => setShowSearchModal(true)} />
        <BsBellFill className="icon text-white" onClick={() => setShowNotifModal(true)} />
        <PopUpModal isVisible={showSearchModal} close={() => setShowSearchModal(false)}>
          <SearchContent data={data} />
        </PopUpModal>
        <PopUpModal isVisible={showNotifModal} close={() => setShowNotifModal(false)}>
          <NotifContent />
        </PopUpModal>
      </div>
    </div>
  )
}
