'use client'
import Navbar from '@/components/Navbar';
import Link from 'next/link'
import Image from 'next/image';
import './style.scss'
import './../hero-section.scss'
import { useRef } from 'react';
import { FaCheckSquare } from 'react-icons/fa';
import googleLogo from './../../public/google.png'
import schoolLogo from './../../public/42.png'
import GithubLogo from './../../public/github.png'

export default function SignIn () {

  //All refs
  const emailMessage = useRef<HTMLParagraphElement>(null);
  const passMessage = useRef<HTMLParagraphElement>(null);
  const checkOne = useRef<HTMLParagraphElement>(null); // for checkbox number 1
  const checkTwo = useRef<HTMLParagraphElement>(null); // for checkbox number 2

  const handleCheckOne = () => {
    if (checkOne.current)
      checkOne.current.classList.toggle("hidden");
  }

  const handleCheckTwo = () => {
    if (checkTwo.current)
      checkTwo.current.classList.toggle("hidden");
  }

  const handleInvalidEmail = (e : any) => {
    e.preventDefault();
    if (e.target.validationMessage.length && emailMessage.current)
      emailMessage.current.innerText = e.target.validationMessage;
  }

  const handleInvalidPassword = (e : any) => {
    e.preventDefault(); 
    if (e.target.validationMessage.length && passMessage.current)
      passMessage.current.innerText = e.target.validationMessage;
  }

  return (
    <div className='container-box'>
      <Navbar />
      <div className='container'>
        <div className="signin-content">
          <div className="signin">
            <h2>Join the game!</h2>
            <p>Go inside the best gamers social network!</p>
            <div className="auth">
              <form action="">
                <div className="email">
                  <label className='label' htmlFor="emailInput" >email</label>
                  <input className='input' id='emailInput' type="email" placeholder='email' autoFocus required onInvalid={handleInvalidEmail} />
                  <div ref={emailMessage} className="error email-error">
                  </div>
                </div>
                <div className="pass">
                  <label className='label' htmlFor="passwordInput">password</label>
                  <input className='input' id='passwordInput' type='password' placeholder='password' required onInvalid={handleInvalidPassword}  ></input>
                  <div className="forgot-pass">
                    <Link href="#">Forgot your password?</Link>
                  </div>
                  <div className="error pass-strength">
                    <div ref={passMessage} className="text"></div>
                  </div>
                </div>
                <div className="checkbox">
                  <input type="checkbox" name="terms" id="terms" value="terms" />
                  <div className="check-icon" onClick={handleCheckOne} >
                    <div ref={checkOne} className="icon hidden">
                      <FaCheckSquare size="16" />
                    </div>
                  </div>
                  <label htmlFor="terms" onClick={handleCheckOne} >I agree to <Link href="#" >terms & conditions</Link> </label>
                </div>
                
                <div className="checkbox">
                  <input type="checkbox" name="terms" id="news" value="news" />
                  <div className="check-icon" onClick={handleCheckTwo}>
                    <div ref={checkTwo} className="icon hidden">
                      <FaCheckSquare size="16" />
                    </div>
                  </div>
                  <label htmlFor='news' onClick={handleCheckTwo} >I&apos;d like to being informed about latest news and tips</label>
                </div>
                <button>
                  sign in
                </button>
                <div className="auto-auth">
                  or you can sign in with
                  <div className='logos'>
                    <div className="google">
                      <Image 
                        src={googleLogo}
                        width={24}
                        height={24}
                        alt='google icon'
                      />
                    </div>
                    <div className="school">
                      <Image 
                        src={schoolLogo}
                        width={34}
                        height={24}
                        alt='google icon'
                      />
                    </div>
                    <div className="github">
                      <Image 
                          src={GithubLogo}
                          width={24}
                          height={24}
                          alt='google icon'
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="signupbtn">
              <button>create an account</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}