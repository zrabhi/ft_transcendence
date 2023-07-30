import Link from 'next/link'
import Logo from './../components/Logo'

const Navbar = () => {
  return (
    <div className="navbar">
      <Logo />
      <ul>
        <Link href='#' >Home</Link>
        <Link href='#' >game history</Link>
        <Link href='#' >instructions</Link>
        <Link href='#' >About us</Link>
        <button className='
          btn px-4 py-2
          ml-4
        '
        >sign in</button>
      </ul>
    </div>
  );
}

export default Navbar;
