import Image from 'next/image'
import logo from './../public/logo.svg'

const Logo = () => {
  return (
    <>
      <div className="logo">
        <Image
          src={logo}
          width={100}
          height={100}
          alt='Logo of the website shows a man playing ping pong game'
        />
      </div>
    </>
  );
}

export default Logo;
