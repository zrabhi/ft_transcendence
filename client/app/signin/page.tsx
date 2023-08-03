'use client'
import Navbar from '@/components/Navbar';
import Link from 'next/link'
import Image from 'next/image';
import './signin.scss'
import './../hero-section.scss'
import { useRef } from 'react';
import { FaCheckSquare } from 'react-icons/fa';
import googleLogo from './../../public/google.png'
import schoolLogo from './../../public/42.png'
import GithubLogo from './../../public/github.png'

export default function SignIn () {

  //All refs
  const emailMessage = useRef();
  const passMessage = useRef();

  // is email valid
  const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
  function isValidEmail(email : string) {
    return emailPattern.test(email);
  }

  const checkOne = useRef();
  const handleCheckOne = () => {
    checkOne.current.classList.toggle("hidden");
  }

  const checkTwo = useRef();
  const handleCheckTwo = () => {
    checkTwo.current.classList.toggle("hidden");
  }

  // const passStrengthRef = useRef();

  const passStrengthInfo = () => {
    // passStrengthRef.current.classList.add('invisible');
    // console.log(passStrengthRef.current.classList);
  }

  const handleInvalidEmail = (e) => {
    e.preventDefault();
    if (e.target.validationMessage.length)
      emailMessage.current.innerText = e.target.validationMessage;
  }

  const handleInvalidPassword = (e) => {
    e.preventDefault();
    if (e.target.validationMessage.length)
      passMessage.current.innerText = e.target.validationMessage;
  }

  return (
    <div className='container-box'>
      <Navbar />
      <div className='container'>
        <div className="singin-content">
          <div className="singin">
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
                  <input className='input' id='passwordInput' type='password' placeholder='password' onChange={passStrengthInfo} required onInvalid={handleInvalidPassword}  ></input>
                  <div className="forgot-pass">
                    <Link href="#">Forgot your password?</Link>
                  </div>
                  <div className="error pass-strength">
                    <div className="bar">
                      <div className="green-bar">

                      </div>
                    </div>
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
          </div>
        </div>
      </div>
    </div>
  );
}