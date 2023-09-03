"use client";
import { SetStateAction, useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Avatar1 from "@/public/images/avatar1.jpeg";
import "./style.scss";
import { useCookies } from "react-cookie";
import {
  baseUrlUsers,
  getRequest,
  postFileRequest,
  postRequest,
  putRequest,
} from "@/app/context/utils/service";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/app/context/AuthContext";

export default function Complete() {
  const { updatingInfos, user, loginError } = useContext(AuthContext);
  const usernameRef = useRef<HTMLDivElement>(null);
  const passwordRef = useRef<HTMLDivElement>(null);

  const avatar : any = useRef();
  const ErrorRef = useRef<HTMLDivElement>(null);

  const [image, setImage] = useState("http://127.0.0.1:8080/api/avatar/pictures/default.jpeg");
  const [cover, setCover] = useState("http://127.0.0.1:8080/api/cover/pictures/default.png");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const router = useRouter();
  const [cookie, setCookie] = useCookies(["access_token"]);

  const RouteList = {
    Profile: "/profile",
    Login: "/login",
  };

  const uploadFile = async (e: any) => {
    const reader = new FileReader();
    reader.onload = async function(ev) {
    if (e.target.files && e.target.files[0]) {
      avatar.current.src =  e.target!.result as string;
      setImage(ev.target!.result as string);
      console.log(e.target.files);
      const data = {
        file: e.target.files[0],
      };
      const formData = new FormData();

      formData.append("file", e.target.files[0]);
      const response = await postFileRequest(
        `${baseUrlUsers}/avatar`,
        formData
      );
      console.log("response is => ", response);
    }
  }
  reader.readAsDataURL(e.target.files[0]);
  };

  const ErrorList = {
    Uauthorized: "Unauthorized",
  };

  const handleSubmitClick = async (e: any) => {
    e.preventDefault();

    // check username not exist in database
    // check password and confirm password match
    if (username.length < 6) {
      usernameRef.current!.innerHTML = "Username must be at least 6 characters";
      return;
    }
    if (password.length < 8) {
      passwordRef.current!.innerHTML = "Password must be at least 8 characters";
      return;
    }
    if (password !== confirmPassword) {
      passwordRef.current!.innerHTML =
        "Password and confirm password do not match";
      return;
    } else {
      const result = await updatingInfos(username, password);
      if (result) router.push("/profile");
      else {
        console.log("error is", loginError);

        ErrorRef.current!.innerHTML = "Invalid Credentials";
      }
    }
  };

  return (
    <div className="complete-info">
      <div className="container-box">
        <div className="complete-box">
          <h2>Set your Personal Details</h2>
          <p>
            feel free to edit you basic information such as username and
            password.
          </p>
          <form action="">
            <div className="input-fields">
              <div className="username">
                <label htmlFor="username">username</label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  defaultValue={!user ? "Username" : user?.username}
                />
              </div>
              <div ref={usernameRef} className="error username-error"></div>
              <div className="password">
                <label htmlFor="password">password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
              </div>
              <div className="confirm-password">
                <label htmlFor="password">confirm password</label>
                <input
                  type="password"
                  name="confirm-password"
                  id="confirm-password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                />
              </div>
              <div ref={passwordRef} className="error pass-error"></div>
              {loginError && (
                <div className="error pass-error">{loginError.message}</div>
              )}
            </div>
            <div className="profile-box">
              <div className="current-pic">
                <img ref={avatar} src={image} alt="avatar" />
              </div>
              <div className="upload-pic">
                <span>upload new photo</span>
                <input
                  type="file"
                  name="profile-pic"
                  id="profile-pic"
                  accept="image/*"
                  onChange={uploadFile}
                />
                {/* <input type="file" name="profile-pic" id="profile-pic" accept='image/*' /> */}
              </div>
            </div>
            <div className="submit">
              <input
                className="w-full p-2 uppercase font-semibold rounded-lg tracking-wider "
                type="submit"
                value="submit"
                onClick={handleSubmitClick}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
