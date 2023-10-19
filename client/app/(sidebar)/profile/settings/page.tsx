"use client";
import SideBar from "@/components/LoggedUser/SideBar/SideBar";
import { useState, useRef, useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import { AuthContext } from "@/app/context/AuthContext";
import "./style.scss";
import {
  baseUrlUsers,
  postCheckRequest,
  postFileRequest,
  putRequest,
} from "@/app/context/utils/service";
import { StaticImageData } from "next/image";
import { LoginError, LoginErrorInit } from "@/app/context/utils/types";
import { showSnackbar } from "@/app/context/utils/showSnackBar";

export default function Settings() {
  // use context to get user data
  const { user, updateUserInfo, tfaDisabled, handleDisable2fa, loginError} =
    useContext(AuthContext);

  // to check if 2fa is enabled or not

  // informations can updated by the user
  const [username, setUsername] = useState(user?.data?.username || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [discord, setDiscord] = useState(user?.data?.discord || "");
  const [twitter, setTwitter] = useState(user?.data?.twitter || "");

  const [usernameMsg, setUsernameMsg] = useState<string>("");
  const [fileMsg, setFileMsg] = useState<string>("");
  const [passwordMatchMsg, setPasswordMatchMsg] = useState<string>("");
  const [currPasswordError, setCurrentPasswordErr] = useState("");
  const [passwordMsg, setPasswordMsg] = useState<string>("");

  const updateMsgRef = useRef<HTMLParagraphElement>(null);

  // those created by zRabhi i didn't understand all of them
  const [upadte, setUpdate] = useState(false);
  const [error, setError] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);
  const typeErrorRef = useRef<HTMLParagraphElement>(null);

  // those also created by zRabhi for upload images
  const [image, setImage] = useState<any>();
  const [avatar, setAvatar] = useState<any>();
  const avatarRef = useRef<HTMLImageElement>(user.avatar);
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
    const formData = new FormData();
    if (type === "avatar") formData.append("file", avatar);
    if (type === "cover") formData.append("file", cover);
    const response = await postFileRequest(`${baseUrlUsers}/${type}`, formData);
    if (response?.error && response?.message === "Unauthorized"){
      showSnackbar("Unauthorized", false)
      return ;
  }
    if (response?.error) {
      // console.log(response);
      setError(true);
      setFileMsg("File Is not an image");
      return false;
    }
    return true;
  };

  const changeAvatar = async (e: any) => {
    setAvatar(e.target.files[0]);
    const reader = new FileReader();
    reader.onload = async function (ev) {
      if (e.target.files && e.target.files[0]) {
        avatarRef.current.src = e.target!.result as string;
        setImage(ev.target!.result as string);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const changeCover = (e: any) => {
    setCover(e.target.files[0]);
  };

  const checkCurrentPassword = async (password: string) => {
    setCurrentPasswordErr("");
    const response = await postCheckRequest(
      `${baseUrlUsers}/user/checkPassword`,
      JSON.stringify({ password })
    );
    if (response?.error && response?.message === "Unauthorized"){
      showSnackbar("Unauthorized", false)
      return ;
  }
    if (response?.error) {
      setCurrentPasswordErr("Inavalid current password");
      setError(true);
      return false;
    }
    return true;
  };
  const isStrongPassword = (password: string) => {
    setPasswordMsg("");
    if (password.length < 8) {
      setError(true);
      setPasswordMsg("password it's not strong enough");
      return false;
    }
    return true;
  };

  const isValidUsername = (username: string) => {
    setUsernameMsg("");
    if (username.length > 0) {
      if (username.length < 4) {
        setError(true);
        setUsernameMsg("Username must be at least 4 characters");
        return false;
      } else if (username.length > 20) {
        setError(true);
        setUsernameMsg("Username must be at most 20 characters");
        return false;
      }
    }
    return true;
  };

  const resetRefs = () => {
    updateMsgRef.current!.innerHTML = "";
    setPasswordMatchMsg("");
    setUsernameMsg("");
    setPasswordMsg("");
    setCurrentPasswordErr("");
    setFileMsg("")
    updateMsgRef.current!.classList.remove("success");
    updateMsgRef.current!.classList.add("error");
  };

  const isNothingToUpdate = () => {
    if (
      username.length === 0 &&
      newPassword.length === 0 &&
      confirmNewPassword.length === 0 &&
      discord.length === 0 &&
      twitter.length === 0 &&
      !avatar &&
      !cover
    ) {
      return true;
    }
    return false;
  };

  const handleSubmitClick = async (e: any) => {
    e.preventDefault();
    resetRefs();
    setError(false);
    if (isNothingToUpdate()) {
      updateMsgRef.current!.innerHTML = "Nothing to update";
      return;
    }
    const access = await checkCurrentPassword(currentPassword);
    if (!access)
      return;
    if (!isValidUsername(username))
      return;
    if (newPassword.length && !isStrongPassword(newPassword))
      return;
    if (newPassword !== confirmNewPassword) {
      setError(true);
      setPasswordMatchMsg("Passwords don't match");
      return;
    }
    if (avatar)
    {
      const res =  await handleImageUpdate("avatar");
      if (!res)
        return ;
    }
    if (cover) await handleImageUpdate("cover");
    if (infos.username || infos.password) {
      const response = await updateUserInfo(infos);
      if (!response)
      {
        setError(true);
        setUsernameMsg("Please Chose Another Username");
        return ;
      }
    }
    showSnackbar("Updated successfully", true)
    updateMsgRef.current!.innerHTML = "Updated successfully";
    updateMsgRef.current!.classList.remove("error");
    updateMsgRef.current!.classList.add("success");
  };

  return (
    <>
      <div className="setting-page min-h-screen">
        <div className="settings">
          <Link
            className="
            btn
            text-white
            px-8 py-2
            mx-auto
            block
            my-8
            "
            href="/profile"
          >
            Go to profile
          </Link>
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
                      placeholder={"Please enter New Username"}
                      autoComplete="off"
                      value={username}
                      onChange={handleUsernameChange}
                    />
                  </div>
                  {error ? (<div className="error">{usernameMsg}</div>) : ""}
                  <div className="input">
                    <label htmlFor="current-password">current password</label>
                    <input
                      type="password"
                      name="current-password"
                      id="current-password"
                      placeholder="entery your current password"
                      autoComplete="off"
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>
                  {error ? <p className="error">{currPasswordError}</p> : ""}
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
                  {error ? <p className="error">{passwordMsg}</p> : ""}
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
                  {error ? <p className="error">{passwordMatchMsg}</p> : ""}
                </form>
                <div className="update-imgs">
                  <div className="update-avatar">
                    <h4>update avatar</h4>
                    <div className="upload">
                      <div className="avatar bg-slate-600 text-2xl">
                        <Image
                          ref={avatarRef}
                          src={!image ? user.avatar : image}
                          width={200}
                          height={200}
                          alt="avatar"
                        />
                      </div>
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
                  </div>
                  {error ?  <p className="error">{fileMsg}</p> : ""}
                  {/* <div className="update-cover">
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
                  </div> */}
                </div>
              </div>
              <div className="tfa-box">
                <h4>Two Factor Authentication</h4>
                {tfaDisabled ? (
                  <Link href="/profile/settings/tfa">Enable 2FA</Link>
                ) : (
                  <Link href="/profile/settings" onClick={handleDisable2fa}>
                    Disable 2FA
                  </Link>
                )}
              </div>
              <button className="submit" onClick={handleSubmitClick}>
                submit
              </button>
              <div
                ref={updateMsgRef}
                className="submit-msg updated error"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
