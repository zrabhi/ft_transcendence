'use client';
import { useRef, useState } from 'react';
import Image from 'next/image';
import Avatar1 from '@/public/images/avatar1.jpeg';
import './style.scss';

export default function Complete() {

  const usernameRef = useRef<HTMLDivElement>(null);
  const passwordRef = useRef<HTMLDivElement>(null);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmitClick = (e: any) => {
    e.preventDefault();
    // check username not exist in database
    // check password and confirm password match
    if (username.length < 6) {
      usernameRef.current!.innerHTML = 'Username must be at least 6 characters';
    }
    if (password.length < 8) {
      passwordRef.current!.innerHTML = 'Password must be at least 8 characters';
    }
    if (password !== confirmPassword) {
      passwordRef.current!.innerHTML = 'Password and confirm password do not match';
    }
  }

  return (
    <div className="complete-info">
      <div className="container-box">
        <div className="complete-box">
          <h2>Set your Personal Details</h2>
          <p>feel free to edit you basic information such as username and password.</p>
            <form action="">
              <div className="input-fields">
                <div className="username">
                  <label htmlFor="username">username</label>
                  <input type="text" name="username" id="username" onChange={(e) => setUsername(e.target.value)} placeholder='Username' />
                </div>
                <div ref={usernameRef} className="error username-error"></div>
                <div className="password">
                  <label htmlFor="password">password</label>
                  <input type="password" name="password" id="password" onChange={(e) => setPassword(e.target.value)} placeholder='Password' />
                </div>
                <div className="confirm-password">
                  <label htmlFor="password">confirm password</label>
                  <input type="password" name="confirm-password" id="confirm-password" onChange={(e) => setConfirmPassword(e.target.value)} placeholder='Confirm Password' />
                </div>
                <div ref={passwordRef} className="error pass-error"></div>
              </div>
              <div className="profile-box">
                <div className="current-pic">
                  <Image 
                    src={Avatar1}
                    alt="avatar"
                  />
                </div>
                <div className="upload-pic">
                    <span>upload new photo</span>
                    <input type="file" name="profile-pic" id="profile-pic" accept='image/*'/>
                    {/* <input type="file" name="profile-pic" id="profile-pic" accept='image/*' /> */}
                </div>
              </div>
              <div className="submit">
                <input className='w-full p-2 uppercase font-semibold rounded-lg tracking-wider ' type="submit" value="submit" onClick={handleSubmitClick} />
              </div>
            </form>
        </div>
      </div>
    </div>
  )
}
