"use client";
import Navbar from "@/components/MainPage/NavBar/Navbar";
import "./style.scss";
import Link from "next/link";
import Image from "next/image";
import "./style.scss";
import "../../hero-section.scss";
import {
  baseUrlAuth,
  getRequest,
  postRequest,
} from "../../context/utils/service";
import { useCallback, useContext, useRef, useState } from "react";
import { FaCheckSquare } from "react-icons/fa";
import googleLogo from "@/public/images/google.png";
import schoolLogo from "@/public/images/42.png";
import GithubLogo from "@/public/images/github.png";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/app/context/AuthContext";

export default function SignIn() {
  //All refs
  const { user, loginError, LogIn } = useContext(AuthContext);
  const emailMessage = useRef<HTMLParagraphElement>(null);
  const passMessage = useRef<HTMLParagraphElement>(null);
  const checkOne = useRef<HTMLParagraphElement>(null); // for checkbox number 1
  const checkTwo = useRef<HTMLParagraphElement>(null); // for checkbox number 2

  // useStates
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });
  const [isLoginLoading, setLoginLoading] = useState(false);
  const router = useRouter();
  const ErrorRef = useRef<HTMLDivElement>(null);

  const handleCheckOne = () => {
    if (checkOne.current) checkOne.current.classList.toggle("hidden");
  };

  const handleCheckTwo = () => {
    if (checkTwo.current) checkTwo.current.classList.toggle("hidden");
  };

  const handleInvalidEmail = (e: any) => {
    e.preventDefault();
    if (e.target.validationMessage.length && emailMessage.current) {
      emailMessage.current.innerText = e.target.validationMessage;
    }
  };

  const handleEmailChange = (e: any) => {
    setLoginInfo((prevData) => ({
      ...loginInfo,
      email: e.target.value,
    }));
  };
  const handlePasswordChange = (e: any) => {
    setLoginInfo((prevData) => ({
      ...loginInfo,
      password: e.target.value,
    }));
  };
  const handleInvalidPassword = (e: any) => {
    e.preventDefault();
    if (e.target.validationMessage.length && passMessage.current) {
      passMessage.current.innerText = e.target.validationMessage;
    }
  };

  const handleClickButton = async (e: any) => {
    e.preventDefault();
    const result = await LogIn(loginInfo);
    if (result) {
      // console.log(user.tfa);
      if (user.tfa){
        return router.push("/login/tfalogin");}
      router.push("/profile");
    } else return (ErrorRef.current!.innerHTML = "Invalid Credentials");

  };

  return (
    <div className="container-box">
      <Navbar />
      <div className="container">
        <div className="signin-content">
          <div className="signin">
            <h2>Join the game!</h2>
            <p>Go inside the best gamers social network!</p>
            <div className="auth">
              <form action="">
                <div className="email">
                  <label className="label" htmlFor="emailInput">
                    email
                  </label>
                  <input
                    className="input"
                    id="emailInput"
                    type="email"
                    placeholder="email"
                    autoFocus
                    required
                    autoComplete='off'
                    defaultValue=''
                    onInvalid={handleInvalidEmail}
                    onChange={handleEmailChange}
                  />

                  <div ref={emailMessage} className="error email-error"></div>
                </div>
                <div className="pass">
                  <label className="label" htmlFor="passwordInput">
                    password
                  </label>
                  <input
                    className="input"
                    id="passwordInput"
                    type="password"
                    placeholder="password"
                    required
                    autoComplete='off'
                    defaultValue=''
                    onInvalid={handleInvalidPassword}
                    onChange={handlePasswordChange}
                  />
                  <div className="error pass-strength">
                    <div ref={passMessage} className="text"></div>
                  </div>
                </div>



                <div ref={ErrorRef} className="errorRef email-error"></div>
                <button onClick={handleClickButton} className=""> sign in</button>
                <div className="auto-auth">
                  <span className="
                  text-gray-400 text-sm ">
                    You can sign in with
                  </span>
                  <div className="logos">
                    <Link href="http://127.0.0.1:8080/api/auth/google/login">
                      <div className="google">
                        <Image
                          src={googleLogo}
                          width={24}
                          height={24}
                          alt="google icon"
                        />
                      </div>{" "}
                    </Link>
                    <Link href="http://127.0.0.1:8080/api/auth/42/login">
                      <div className="school">
                        <Image
                          src={schoolLogo}
                          width={34}
                          height={24}
                          alt="google icon"
                        />
                      </div>
                    </Link>
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
