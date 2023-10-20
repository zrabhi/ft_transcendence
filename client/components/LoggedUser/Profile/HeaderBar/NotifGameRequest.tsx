import { AuthContext } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import React, { useContext } from "react";
import {FaCheck, FaUserAlt} from 'react-icons/fa'
import {FcCancel} from 'react-icons/fc'

export default function NotifGameRequest({ data, setRequests, requests }: any) {
  const { notifSocket , user} = useContext(AuthContext);
  const handleAcceptGame = () => {
    notifSocket.emit("gameAccepted", { username: data.username });
    setRequests(requests?.filter((request: any)=> request.username != data.username)); 
    
  };
  const handleRefuseGame = () => {
    notifSocket.emit("gameRefused", {username: data.username})
    setRequests(requests?.filter((request: any)=> request.username != data.username)); 
  };
  return (
    <div className='flex flex-row justify-between'>
    <div className="flex flex-col gap-2">
      <div className='flex justify-between items-center'>
        <span className="text-sm font-semibold">{data.username}</span>
      </div>
      <span className="text-sm font-semibold">Game Request</span>
    </div>
    <div className='flex flex-row justify-center items-center gap-2'>
      <FaCheck onClick={handleAcceptGame} style={{color: 'green', width: "18px", height: '18px'}} />
      <FcCancel onClick={handleRefuseGame} style={{width: "18px", height: '18px'}} />
    </div>
  </div>
  );
}
