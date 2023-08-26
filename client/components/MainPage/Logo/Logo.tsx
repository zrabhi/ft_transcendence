import Image from 'next/image'
import logo from '@/public/images/logo.svg'
import Link from 'next/link';

const Logo = () => {
  return (
    <>
      <Link href="/" >
      <div className="logo">
        <Image
          src={logo}
          width={100}
          height={100}
          alt='Logo of the website shows a man playing ping pong game'
        />
      </div>
      </Link>
    </>
  );
}

export default Logo;
