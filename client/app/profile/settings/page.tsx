'use client'
import SideBar from '@/components/LoggedUser/SideBar/SideBar'
import {useState, useRef, useContext } from 'react'
import Link from 'next/link'
import { AuthContext } from '@/app/context/AuthContext'
import './style.scss'

export default function Settings() {

  const { getUserData, user } = useContext(AuthContext);

  const [tfaDisabled, setTfaDisabled] = useState(true);

  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);

  const handleAvatarClick = () => {
    if (avatarInputRef.current) {
      avatarInputRef.current.click();
    }
  };

  const handleCoverClick = () => {
    if (coverInputRef.current) {
      coverInputRef.current.click();
    }
  };

  const [username, setUsername] = useState(user?.data?.username || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  return (
    <>
      <div className="setting-page min-h-screen">
        <div className="settings">
          <Link className='
            btn
            text-white 
            text-xl 
            px-8 py-2 
            mx-auto 
            block
            capitalize
            rounded-lg
            my-8
            ' 
            href='/profile'>go to profile</Link>
          <div className="setting-box">
            <h3 className='mx-auto'>Update your Informations</h3>
            <div className="forms">
              <div className="account-form">
                <form action="">
                  <div className="input">
                    <label htmlFor="username">username</label>
                    <input type="text" name="username" id="username" placeholder='enter your username'
                    autoComplete='off'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="input">
                    <label htmlFor="current-password">current password</label>
                    <input 
                      type="password" name="current-password" 
                      id="current-password" placeholder='entery your current password' 
                      autoComplete='off'
                    />
                  </div>
                  <div className="input">
                    <label htmlFor="password">password</label>
                    <input type="password" name="password" id="password" placeholder='entery your password' />
                  </div>
                  <div className="input">
                    <label htmlFor="confirm-password">confirm password</label>
                    <input type="password" 
                      name="confirm-password" 
                      id="confirm-password" 
                      placeholder='re-enter your password'
                      autoComplete='off'
                    />
                  </div>
                </form>
                <div className="update-imgs">
                  <div className="update-avatar">
                    <h4>update avatar</h4>
                    <div className="input">
                      <input ref={avatarInputRef} 
                        type="file" 
                        name="avatar" 
                        id="avatar"
                        autoComplete='off'
                      />
                      <span id='avatarSpan' onClick={handleAvatarClick} >upload new avatar picture</span>
                    </div>
                  </div>
                  <div className="update-cover">
                    <h4>update cover</h4>
                    <div className="input">
                      <input ref={coverInputRef} 
                        type="file" 
                        name="cover" 
                        id="cover"
                        autoComplete='off'
                      />
                      <span id='coverSpan' onClick={handleCoverClick} >upload new cover picture</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="tfa-box">
                <h4>Two Factor Authentication</h4>
                {tfaDisabled ? (
                  <Link href='/profile/settings/tfa'>
                    Enable 2FA
                  </Link>
                ) : (
                  <Link href='/profile/settings/tfa'>
                    Disable 2FA
                  </Link>
                )}
              </div>
              <div className="social-form">
                <form action="">
                  <div className="input">
                    <label htmlFor="discord">discord</label>
                    <input 
                      type="text" 
                      name="discord" 
                      id="discord" 
                      placeholder='enter your discord link'
                      autoComplete='off'
                    />
                  </div>
                  <div className="input">
                    <label htmlFor="twitter">twitter</label>
                    <input 
                      type="text" 
                      name="twitter" 
                      id="twitter" 
                      placeholder='Enter your twitter link' 
                      autoComplete='off'
                    />
                  </div>
                </form>
              </div>
              <input className='submit' type="submit" value="submit" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
