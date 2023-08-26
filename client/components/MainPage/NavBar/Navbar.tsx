'use client'
import Link from 'next/link'
import Logo from '@/components/MainPage/Logo/Logo'
import './Navbar.scss'
import { useRef, useState } from 'react'
import {BsList} from 'react-icons/Bs'
import { FaTimes } from 'react-icons/fa'

const Navbar = () => {

  const listRef = useRef<HTMLUListElement>(null);

  const showList = () => {
    if (listRef.current)
      listRef.current.classList.toggle("showList");
  }

  return (
    <header>
      <div className="container">
        <nav className="navbar">
          <Logo />
          <ul ref={listRef} className='' >
            <li>
              <Link className='link' href='/' >Home</Link>
            </li>
            <li>
              <Link className='link' href='/game-history' >game history</Link>
            </li>
            <li>
              <Link className='link' href='/instructions' >instructions</Link>
            </li>
            <li>
              <Link className='link' href='about-us' >About us</Link>
            </li>
              <Link href='/signin' >
                <button className='
                  signin-btn
                  px-4 py-2
                  ml-4'
                  >
                  sign in
                </button>
              </Link>
              <div className="close-list" onClick={showList}>
                <FaTimes size={32} />
              </div>
          </ul>
          <button className='drop-down' style={{color: "#fff"}} >
            <BsList size={32} onClick={showList} />
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
