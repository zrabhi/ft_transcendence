import Navbar from '@/components/Navbar';
import Link from 'next/link'
import Image from 'next/image';
import './signin.scss'
import './../hero-section.scss'
import pongGif from './../../public/pong.gif'

export default function SignIn () {
  return (
    <>
      <Navbar />
      <div className='container'>
        <div className="singin-content">
          <div className="img">
            <Image
              src={pongGif}
              width={400}
              height={400}
              alt="video showing the pong goame who looks like"
            />
          </div>
          <div className="singin">
            <h2>Join the game!</h2>
            <p>Go inside the best gamers social network!</p>
            <div className="auth">
              <form action="">
                <label htmlFor="">email</label>
                <input type="email" placeholder='email' autoFocus/>
                <label htmlFor="">password</label>
                <input type='password' placeholder='password' ></input>
                <div className="forgot-pass">
                  <Link href="#">Forgot your password?</Link>
                </div>
                <div className="pass-strength">
                  <div className="bar">
                    <div className="green-bar">

                    </div>
                  </div>
                  <div className="text">week password</div>
                </div>
              </form>
              <div className="checkbox">
                <input type="checkbox" name="terms" id="terms" value="terms" />
                <label htmlFor="">I agree to <Link href="#" >terms & conditions</Link> </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}