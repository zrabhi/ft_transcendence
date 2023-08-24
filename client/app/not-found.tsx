import Navbar from '@/components/MainPage/NavBar/Navbar'
import React from 'react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="not-found">
      <div className="container">
        <div className="content text-slate-200 text-4xl text-center my-96">
          <h1>404 - Page Not Found</h1>
          <Link href='/' className='link block my-12 mx-auto font-bold px-8 py-4 capitalize rounded-lg' >back to home</Link>
        </div>
      </div>
    </div>
  )
}
