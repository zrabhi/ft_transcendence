'use client';
import React, { useContext, useEffect, useRef, useState } from 'react'
import './style.scss';
import Avatar1 from "@/public/images/avatar1.jpeg";
import Image from 'next/image';
import { baseUrlAuth, getQrCode, postRequest } from '@/app/context/utils/service';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/app/context/AuthContext';


export default function TfaPage() {
  const {fetchUserData } = useContext(AuthContext);
  const [qrCodeImage, setQrCodeImage] = useState<any>()
  const [isEnabeld , setIsEnabeld] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [code, setCode] = useState<string>('')
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() =>{
    (async () =>
    {
        const  response = await getQrCode(`${baseUrlAuth}/2fa/generate`);
        setQrCodeImage(response);
        // console.log(response);
    })()
  },[])


    const codeVerifitacion  = async (code: string) =>
    {
      setError(false);
      const response = await postRequest(`${baseUrlAuth}/2fa/turn-on`, JSON.stringify({twoFactorAuthenticationCode: code}));
      if (response.error)
      {
        setError(true);
        setErrorMsg(response.message);
        return false;
      }
      return true;
    }

    const handleOnChange = (e: any) =>
    {
      setCode(e.target.value);
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
        setErrorMsg("The Authetification code is 6 Digits");
        return false;
      }
      return true
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
        router.replace("/profile/settings");
      }
    }

  return (
    <div className="tfa-page">
      <div className="content">
        <h4 className='text-white text-2xl capitalize'>Two factor setup</h4>
        <p>Take these few steps to enable two-factor authentication and make your account more secure</p>
        <div className="qr-code">
          <div className="qr-code-box">
              <Image src={qrCodeImage}
              width={200}
              height={200}
              alt="User Qr Code"
              />
          </div>
        </div>
        <div className="input-code" >
          <input type="text" name="text" id="text" placeholder='Authentication Code' autoComplete='off' onChange={handleOnChange} />
        </div>
        <button type='submit' className='capitalize' onClick={handleEnbaleClick} >enable</button>
        {error ?  (<p className="error" >{errorMsg} </p>) : ""}
        {success ? (<p className="success" >{successMsg}</p>) : ""}
      </div>
    </div>
  )
}
