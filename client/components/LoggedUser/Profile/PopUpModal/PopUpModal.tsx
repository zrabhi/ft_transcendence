import React from 'react'
import { useState } from 'react'
import { GrClose } from 'react-icons/gr'

export default function PopUpModal({ isVisible, close }: any) {

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

        <div className="input">
          <input type='text' placeholder='Enter the username'
          className='w-4/5 px-6 py-2 mx-auto rounded-[.5rem] bg-slate-300
            focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-opacity-50
            block placeholder-capitalize text-black font-semibold
          '
          />
          <input type="submit" value="SEARCH" 
            className='w-4/5 p-2 mx-auto block mt-8 rounded-[.5rem] bg-purple-600
            bg-opacity-50 text-white font-semibold cursor-pointer
            hover:bg-opacity-70 transition duration-300 ease-in-out
            '
          />
        </div>
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
