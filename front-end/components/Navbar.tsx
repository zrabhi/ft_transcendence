import Link from 'next/link'
import Logo from './../components/Logo'
import './styles/Navbar.scss'

const Navbar = () => {
  return (
    <div className="navbar">
      <Logo />
      <ul>
        <Link className='link' href='#' >Home</Link>
        <Link className='link' href='#' >game history</Link>
        <Link className='link' href='#' >instructions</Link>
        <Link className='link' href='#' >About us</Link>
        <Link href='/signin' >
          <button className='
            btn px-4 py-2
            ml-4'
          >
            sign in
          </button>
        </Link>
      </ul>
    </div>
  );
}

export default Navbar;
