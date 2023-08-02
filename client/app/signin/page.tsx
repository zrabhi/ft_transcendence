'use client'
import Navbar from '@/components/Navbar';
import Link from 'next/link'
import Image from 'next/image';
import './signin.scss'
import './../hero-section.scss'
import pongGif from './../../public/pong.gif'
import { useRef } from 'react';

export default function SignIn () {

  // const passStrengthRef = useRef();

  const passStrengthInfo = () => {
    // passStrengthRef.current.classList.add('invisible');
    // console.log(passStrengthRef.current.classList);
  }

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
                <div className="email">
                  <label htmlFor="emailInput">email</label>
                  <input id='emailInput' type="email" placeholder='email' autoFocus/>
                </div>
                <div className="pass">
                  <label htmlFor="passwordInput">password</label>
                  <input id='passwordInput' type='password' placeholder='password' onChange={passStrengthInfo} ></input>
                  <div className="forgot-pass">
                    <Link href="#">Forgot your password?</Link>
                  </div>
                  <div className="pass-strength ">
                    <div className="bar">
                      <div className="green-bar">

                      </div>
                    </div>
                    <div className="text">week password</div>
                  </div>
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