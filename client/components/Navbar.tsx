'use client'
import Link from 'next/link'
import Logo from './../components/Logo'
import './styles/Navbar.scss'
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
    // <div>This is navbar</div>
    <header>
      <div className="container">
        <nav className="navbar">
          <Logo />
          <ul ref={listRef} className='' >
            <li>
              <Link className='link' href='#' >Home</Link>
            </li>
            <li>
              <Link className='link' href='#' >game history</Link>
            </li>
            <li>
              <Link className='link' href='#' >instructions</Link>
            </li>
            <li>
              <Link className='link' href='#' >About us</Link>
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
