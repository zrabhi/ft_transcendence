import { AuthContext } from '@/app/context/AuthContext';
import { baseUrlUsers, putRequest } from '@/app/context/utils/service';
import { showSnackbar } from '@/app/context/utils/showSnackBar';
import { useRouter } from 'next/navigation'
import React, { useContext } from 'react'

import {FaCheck, FaUserAlt} from 'react-icons/fa'
import {FcCancel} from 'react-icons/fc'

export default function NotifFriendRequest({data, setRequests, requests}: any) {
  const router = useRouter();
  const {
    friendsList,
    setFriendsList,
    fetchFriendList,
    friendRequestSent,
    setFriendRequestSent,
    userFriendRequests,
    setUserFriendRequests,
    notifSocket,
  } = useContext(AuthContext);
  const handleRedirectProfile = () =>
  {
    router.push(`/profile/${data.username}`);
  }

  const cancelRequestHandler = async () => {
    try {
      const response = await putRequest(
        `${baseUrlUsers}/cancelFriendRequest/${data.username}`,
        ""
      );
      console.log("cancle ++", response);
      
      if (response?.error && response?.message === "Unauthorized"){
        showSnackbar("Unauthorized", false)
        return ;
    }
      const updatedFriendRequest = friendRequestSent.filter((friend: any) => {
        return friend !== data.username;
      });
      setFriendRequestSent(updatedFriendRequest);
      setRequests(requests?.filter((request: any)=> request.username != data.username));  
      showSnackbar("friend request cancled successfully", true);
    } catch (error) {
    }
  };


  const acceptFriendHandler = async () => {
    try {
      notifSocket.emit("AccepetFriendRequest", {username: data.username});
    //   const response = await putRequest(`${baseUrlUsers}/acceptFriendRequest/${data.username}`,"");
    //   if (response?.error && response?.message === "Unauthorized"){
    //     showSnackbar("Unauthorized", false)
    //     return ;
    // }
      // let updateUserFriendRequests = userFriendRequests.filter((member: any) =>{
      //   return member.username !== data.username;
      // })
      // setUserFriendRequests(updateUserFriendRequests);
      setRequests(requests?.filter((request: any)=> request.username != data.username));
      await fetchFriendList();
      // showSnackbar(`${data.username} Is your friend now`, true);
    } catch (error) {
    }
  }
  
  const handleAccept = async () => {
    await acceptFriendHandler();
    alert('accept')
  }
  const handleRefuse = async () => {
    await cancelRequestHandler();
    alert('accept')
  }
  return (
    <div className='flex flex-row justify-between'>
      <div className="flex flex-col gap-2">
        <div className='flex justify-between items-center'>
          <span className="text-sm font-semibold">{data.username}</span>
        </div>
        <span className="text-sm font-semibold">Friend Request</span>
      </div>
      <div className='flex flex-row justify-center items-center gap-2'>
        <FaUserAlt onClick={handleRedirectProfile} style={{color: "#000000", width: "18px", height: '18px'}} />
        <FaCheck onClick={handleAccept} style={{color: 'green', width: "18px", height: '18px'}} />
        <FcCancel onClick={handleRefuse} style={{width: "18px", height: '18px'}} />
      </div>
    </div>
  )
}
