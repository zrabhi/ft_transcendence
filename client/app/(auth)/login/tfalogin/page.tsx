'use client';
import React, { useEffect, useRef, useState } from 'react'
import './style.scss';
import Avatar1 from "@/public/images/avatar1.jpeg";
import Image from 'next/image';
import { baseUrlAuth, getQrCode, postRequest } from '@/app/context/utils/service';
import { useRouter } from "next/navigation";


export default function TfaPage() {

    const [error, setError] = useState<boolean>(false);
    const [code, setCode] = useState<string>('');
    const [errorMsg, setErrorMsg] = useState<string>('');
    const [successMsg, setSuccessMsg] = useState<string>('');
    const [success, setSuccess] = useState<boolean>(false);
    const router = useRouter();

    const handleOnChange = (e: any) =>
    {
      setCode(e.target.value);
      // console.log(code);
    }
    const inputVerify = () =>
    {
      let numberArgs = new RegExp("^[0-9].*")
      if (code === "")
      {
        setError(true);
        setErrorMsg("Please enter Your Authetification code");
        return false;
      }
      else if (!numberArgs.test(code) || code.length < 6 || code.length > 6 )
      {
        setError(true);
        setErrorMsg("The Authetification code is 6 Digits ");
        return false;
      }
      return true
    }

    const codeVerifitacion  = async (code: string) =>
    {
      setError(false);
      const response = await postRequest(`${baseUrlAuth}/2fa/turn-on`, JSON.stringify({twoFactorAuthenticationCode: code}));
      // console.log(response);
      if (response.error)
      {
        setError(true);
        setErrorMsg(response.message);
        (error);
        // console.log(errorMsg);
        return false;
      }
      return true;
    }

    const handleEnbaleClick = async (e: any) =>
    {
      e.preventDefault();
      setError(false);
      setSuccess(false);
      setSuccessMsg("");
      if (!inputVerify())
        return ;
      setErrorMsg("");
      if (await codeVerifitacion(code))
      {
        setSuccess(true);
        setSuccessMsg("successfully authenticated");
        router.push('/profile');
      }
    }

    return (
      <div className="complete-info">
        <div className="container-box">
          <div className="complete-box">
            <h2>Two Factor Authentication Verification</h2>
            <p>
              Please enter your 6 digits code
            </p>
          <div className="input-code" >
          <input type="text" name="text" id="text" placeholder='Authentication Code' autoComplete='off' onChange={handleOnChange} />
        </div>
        <button type='submit' className='capitalize' onClick={handleEnbaleClick} >Verify</button>
        {error ?  (<p className="error" >{errorMsg} </p>) : ""}
        {success ? (<p className="success" >{successMsg}</p>) : ""}
        </div>
      </div>
    </div>
    );
  }

