"use client";
import SideBar from "@/components/LoggedUser/SideBar/SideBar";
import { useState, useRef, useContext } from "react";
import Link from "next/link";
import { AuthContext } from "@/app/context/AuthContext";
import "./style.scss";
import { baseUrlUsers, postFileRequest } from "@/app/context/utils/service";
import { StaticImageData } from "next/image";
import { Avatar } from "@radix-ui/themes";
import { LoginError, LoginErrorInit } from "@/app/context/utils/types";

export default function Settings() {
  // use context to get user data
  const { getUserData, user, updateUserInfo } = useContext(AuthContext);
  
  // to check if 2fa is enabled or not
  const [tfaDisabled, setTfaDisabled] = useState(true);
  
  // informations can updated by the user
  const [username, setUsername] = useState(user?.data?.username || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [discord, setDiscord] = useState(user?.data?.discord || '');
  const [twitter, setTwitter] = useState(user?.data?.twitter || '');

  const usernameMsgRef = useRef<HTMLParagraphElement>(null);
  const passwordMsgRef = useRef<HTMLParagraphElement>(null);
  const passwordMatchMsgRef = useRef<HTMLParagraphElement>(null);

  // those created by zRabhi i didn't understand all of them
  const [upadte, setUpdate] = useState(false)
  const [error, setError] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);
  const ErrorRef = useRef<HTMLParagraphElement>(null);
  const currPasswordRef = useRef<HTMLDivElement>(null);
  const updateMsgRef = useRef<HTMLParagraphElement>(null);


  // those also created by zRabhi for upload images
  const [avatar, setAvatar] = useState<any>();
  const [cover, setCover] = useState<any>();

  // data that will be sent to the server
  const [infos, setInfos] = useState({
    username: null,
    password: null,
    discord: null,
    twitter: null,
  });

  const handleAvatarClick = () => {
    if (avatarInputRef.current) {
      avatarInputRef.current.click();
    }
  };

  const handleNewPassword = (e: any) => {
    setNewPassword(e.target.value);
    setInfos((predData) => ({
      ...infos,
      password: e.target.value,
    }));
  };

  const handleUsernameChange = (e: any) => {
    setUsername(e.target.value);
    setInfos((predData) => ({
      ...infos,
      username: e.target.value,
    }));
  };

  const handleDiscordChange = (e: any) => {
    setDiscord(e.target.value);
    setInfos((predData) => ({
      ...infos,
      discord: e.target.value,
    }));
  };

  const handleTwitterChange = (e: any) => {
    setTwitter(e.target.value);
    setInfos((predData) => ({
      ...infos,
      twitter: e.target.value,
    }));
  };

  const handleCoverClick = () => {
    if (coverInputRef.current) {
      coverInputRef.current.click();
    }
  };

  const handleImageUpdate = async (type: string) => {
    ErrorRef.current!.innerHTML = "";
    const formData = new FormData();
    if (type === "avatar") formData.append("file", avatar);
    if (type === "cover") formData.append("file", cover);
    const response = await postFileRequest(`${baseUrlUsers}/${type}`, formData);
    if (response.error) {
      setError(true);
      ErrorRef.current!.innerHTML = "Invalid file type or format";
      return false;
    }
    return true;
  };

  const changeAvatar = async (e: any) => {
    console.log(e.target.files);
    setAvatar(e.target.files[0]);
    console.log("avaatr ", avatar);
  };

  const changeCover = (e: any) => {
    setCover(e.target.files[0]);
  };

  const checkCurrentPassword = async (password: string) => {
    // check if current password is valid
    return false;
  }

  const isStrongPassword = (password: string) => {
    return true;
  }

  const isValidUsername = (username: string) => {
    if (username.length > 0) {
      if (username.length < 4) {
        usernameMsgRef.current!.innerHTML = "Username must be at least 4 characters";
        setError(true);
      } else if (username.length > 20) {
        usernameMsgRef.current!.innerHTML = "Username must be at most 20 characters";
        setError(true);
      } 
    }
    return true;
  }

  const resetRefs = () => {
    usernameMsgRef.current!.innerHTML = "";
    passwordMsgRef.current!.innerHTML = "";
    passwordMatchMsgRef.current!.innerHTML = "";
    updateMsgRef.current!.innerHTML = "";
  };

  const handleSubmitClick = async (e: any) => {
    e.preventDefault();
    resetRefs();
    setError(false);
    if (!checkCurrentPassword(currentPassword)) {
      currPasswordRef.current!.innerHTML = "Invalid current password";
      return ;
    }
    if (!isValidUsername(username)) {
      usernameMsgRef.current!.innerHTML = "Invalid username";
    }
    if (isStrongPassword(newPassword)) {
      passwordMsgRef.current!.innerHTML = "password it's not strong enough";
    }
    if (newPassword !== confirmNewPassword) {
      passwordMatchMsgRef.current!.innerHTML = "Passwords don't match";
      setError(true);
    }
    if (avatar) 
      await handleImageUpdate("avatar");
    if (cover) 
      await handleImageUpdate("cover");
    
  };

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
            <h3 className="mx-auto">Update your Informations</h3>
            <div className="forms">
              <div className="account-form">
                <form action="">
                  <div className="input">
                    <label htmlFor="username">username</label>
                    <input type="text" name="username" id="username" placeholder='enter your username'
                    autoComplete='off'
                    value={username}
                    onChange={handleUsernameChange}
                    />
                  </div>
                  <div ref={usernameMsgRef} className="error"></div>
                  <div className="input">
                    <label htmlFor="current-password">current password</label>
                    <input 
                      type="password" name="current-password" 
                      id="current-password" placeholder='entery your current password' 
                      autoComplete='off'
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>
                  <div className="input">
                    <label htmlFor="password">password</label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      placeholder="entery your password"
                      onChange={handleNewPassword}
                    />
                  </div>
                  <p ref={passwordMsgRef} className="error"></p>
                  <div className="input">
                    <label htmlFor="confirm-password">confirm password</label>
                    <input
                      type="password"
                      name="confirm-password"
                      id="confirm-password"
                      placeholder="re-enter your password"
                      autoComplete="off"
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />
                  </div>
                  <p ref={passwordMatchMsgRef} className="error"></p>
                </form>
                <div className="update-imgs">
                  <div className="update-avatar">
                    <h4>update avatar</h4>
                    <div className="input">
                      <input
                        ref={avatarInputRef}
                        type="file"
                        name="avatar"
                        id="avatar"
                        autoComplete="off"
                        onChange={changeAvatar}
                      />
                      <span id="avatarSpan" onClick={handleAvatarClick}>
                        upload new avatar picture
                      </span>
                    </div>
                  </div>
                  <div className="update-cover">
                    <h4>update cover</h4>
                    <div className="input">
                      <input
                        ref={coverInputRef}
                        type="file"
                        name="cover"
                        id="cover"
                        autoComplete="off"
                        onChange={changeCover}
                      />
                      <span id="coverSpan" onClick={handleCoverClick}>
                        upload new cover picture
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="tfa-box">
                <h4>Two Factor Authentication</h4>
                {tfaDisabled ? (
                  <Link href="/profile/settings/tfa">Enable 2FA</Link>
                ) : (
                  <Link href="/profile/settings/tfa">Disable 2FA</Link>
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
                      autoComplete="off"
                      placeholder="enter your discord link"
                      onChange={handleDiscordChange}
                    />
                  </div>
                  <div className="input">
                    <label htmlFor="twitter">twitter</label>
                    <input
                      type="text"
                      name="twitter"
                      id="twitter"
                      autoComplete="off"
                      placeholder="Enter your twitter link"
                      onChange={handleTwitterChange}
                    />
                  </div>
                </form>
              </div>
              <button
                className="submit"
                onClick={handleSubmitClick}
              >
                submit
              </button>
              <div ref={updateMsgRef} className="submit-msg updated pass-error"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
