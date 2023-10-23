import React, { useContext, useEffect, useState } from "react";
import NotifItem from "./NotifItem";
import { AuthContext } from "@/app/context/AuthContext";
import { baseUrlUsers, getRequest } from "@/app/context/utils/service";

export default function NotifContent() {
  const {
    notif,
    userFriendRequests,
    setUserFriendRequests,
    fetchFriendRequests,
    gameRequest,
    fetchGameRequest,
  } = useContext(AuthContext);

const [requests, setRequests] = useState<any>([])
  useEffect(() => {
    try{
    (async () => {
      await fetchFriendRequests();
      await fetchGameRequest();
    })();
    setRequests([...userFriendRequests, ...gameRequest]);
  }catch(err)
  {
    
  }
  }, []);
  // notif has avatar and username of the sender and the type of notif
  // and we will discuss the notif how to check the stats of the notif
  // friendRequest => accept or reject
  // recieveMessage => onClick => redirect to chat
  // gameRequest => accept or reject

  
  return (
    <div className="notif-content">
      <h3 className="text-lg tracking-wider font-semibold absolute top-4">
        Notifications
      </h3>
      <div className="notif-list mt-4">
        {requests.map((item: any, index: any) => (
          <NotifItem key={index} data={item} setRequests={setRequests} requests={requests} />
        ))}
      </div>
    </div>
  );
}
