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
  const { getUserData, user, updateUserInfo } = useContext(AuthContext);

  const [tfaDisabled, setTfaDisabled] = useState(true);

  const [upadte, setUpdate] = useState(false)
  const [error, setError] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);
  const passwordMessage = useRef<HTMLParagraphElement>(null);
  const usernameRef = useRef<HTMLDivElement>(null);
  const ErrorRef = useRef<HTMLParagraphElement>(null);
  const passwordRef = useRef<HTMLDivElement>(null);
  const updatedRef = useRef<HTMLParagraphElement>(null);

  const [confirmPassword, setConfirmPassword] = useState("");

  const [avatar, setAvatar] = useState<any>();
  const [cover, setCover] = useState<any>();

  const [infos, setInfos] = useState({
    username: null,
    password: null,
    discord: null,
    twitter: null,
  });
  // TODO:userInformation updatinggg

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const handleAvatarClick = () => {
    if (avatarInputRef.current) {
      avatarInputRef.current.click();
    }
  };

  const handlePasswordChange = (e: any) => {
    setPassword(e.target.value);

    setInfos((predData) => ({
      ...infos,
      password: e.target.value,
    }));
  };

  const handleUsernameChange = (e: any) => {
    setUserName(e.target.value);
    setInfos((predData) => ({
      ...infos,
      username: e.target.value,
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

    // const reader = new FileReader();
    // const formData = new FormData();
    // reader.onload = async function(ev)
    // {
    //   if (e.target.files && e.target.files[0]){
    //     setAvatar(e.target!.files[0]);
    //   }
    // }
    // setAvatar(formData);
    // formData.append("file", e.target.files[0]);
    // const response = await postFileRequest(`${baseUrlUsers}/avatar`, formData);
    // console.log("response is => ", response);
  };

  const changeCover = (e: any) => {
    setCover(e.target.files[0]);
  };

  const resetRefs = () => {
    usernameRef.current!.innerHTML = "";
    passwordRef.current!.innerHTML = "";
    passwordRef.current!.innerHTML = "";
    updatedRef.current!.innerHTML = "";
  };

  const handleClick = async (e: any) => {
    resetRefs();

    if (infos.username && userName.length < 6)
      usernameRef.current!.innerHTML = "Username must be at least 6 characters";
    else if (infos.password && password.length < 8)
      passwordRef.current!.innerHTML = "Password must be at least 8 characters";
    else if (infos.password && password && confirmPassword != password)
      passwordRef.current!.innerHTML =
        "Password and confirm password do not match";
    if (avatar) 
      await handleImageUpdate("avatar");
    if (cover) 
      await handleImageUpdate("cover");
    if (!error)
        updatedRef.current!.innerHTML = "Informations updated succefully"

    // await updateUserInfo(infos);
    // if (password !== confirmPassword) {
    //   passwordRef.current!.innerHTML =
    //     "Password and confirm password do not match";
    //   return;

    // if (infos.password && !infos.password)
    //     return passwordMessage.current!.innerText = "Please enter matched password"
  };

  return (
    <>
      <SideBar />
      <div className="setting-page min-h-screen">
        <div className="settings">
          <div className="setting-box">
            <h3 className="mx-auto">Update your Informations</h3>
            <div className="forms">
              <div className="account-form">
                <form action="">
                  <div className="input">
                    <label htmlFor="username">username</label>
                    <input
                      type="text"
                      name="username"
                      id="username"
                      placeholder="enter your username"
                      onChange={handleUsernameChange}
                    />
                  </div>
                  <div ref={usernameRef} className="error username-error"></div>
                  <div className="input">
                    <label htmlFor="password">password</label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      placeholder="entery your password"
                      onChange={handlePasswordChange}
                    />
                  </div>
                  <div className="input">
                    <label htmlFor="confirm-password">confirm password</label>
                    <input
                      type="password"
                      name="confirm-password"
                      id="confirm-password"
                      placeholder="re-enter your password"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <div ref={passwordRef} className="error pass-error"></div>
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
                        onChange={changeCover}
                      />
                      <span id="coverSpan" onClick={handleCoverClick}>
                        upload new cover picture
                      </span>
                    </div>
                  </div>
                <div ref={ErrorRef} className="errorRef email-error"></div>
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
                      placeholder="enter your discord link"
                    />
                  </div>
                  <div className="input">
                    <label htmlFor="twitter">twitter</label>
                    <input
                      type="text"
                      name="twitter"
                      id="twitter"
                      placeholder="Enter your twitter link"
                    />
                  </div>
                </form>
              </div>
              <input
                className="submit"
                type="submit"
                value="submit"
                onClick={handleClick}
              />
              <div ref={updatedRef} className="updated pass-error"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
