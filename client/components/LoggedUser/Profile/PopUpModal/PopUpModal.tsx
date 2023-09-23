import React from 'react'
import { useState } from 'react'
import { GrClose } from 'react-icons/gr'

export default function PopUpModal({ isVisible, close, children }: any) {

  if (!isVisible) return (<></>)

  const handleCloseModal = (e: any) => {
    if (e.target.classList.contains('modal')) close()
  }

  return (
    <div className="modal fixed inset-0 bg-slate-400 bg-opacity-20 
      backdrop-blur-sm flex justify-center items-center
      z-50
      "
      onClick={handleCloseModal}
    >
      <div className="content w-[40rem] xs:w-[18rem] sm:w-[24rem] md:w-[30rem]
        bg-slate-500 rounded-xl bg-opacity-50 relative p-4 pt-12 pb-8
      ">
        {children}
        <div className="close-icon absolute top-2 right-2 bg-slate-300
          flex justify-center items-center rounded-full w-8 h-8 hover:bg-red-200
          cursor-pointer 
        " onClick={close}
        >
          <button className=''>
            <GrClose className='text-black text-2xl w-4 h-4 font-semibold' />
          </button>
        </div>
      </div>
    </div>
  )
}
