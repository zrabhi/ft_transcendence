import React, { useContext, useEffect, useState } from "react";
import NotifItem from "./NotifItem";
import { AuthContext } from "@/app/context/AuthContext";
import { baseUrlUsers, getRequest } from "@/app/context/utils/service";
import { InvitationSocketContext } from "@/app/context/notifContext";

export default function NotifContent() {
  const {
    notif,
    userFriendRequests,
    setUserFriendRequests,
    fetchFriendRequests,
    gameRequest,
    setGameRequest
  } = useContext(AuthContext);

  const notifSocket = useContext(InvitationSocketContext);
  // notif types
  //   1 => friendRequest
  //   2 => recieveMessage
  //   3 => gameRequest

  useEffect(() => {

    (async () => {
      await fetchFriendRequests();
    })();
    return ()=>{
      notifSocket.disconnect();
    }
  }, []);
  // notif has avatar and username of the sender and the type of notif
  // and we will discuss the notif how to check the stats of the notif
  // friendRequest => accept or reject
  // recieveMessage => onClick => redirect to chat
  // gameRequest => accept or reject

  // const notif = [
  //   {
  //     type: 1,
  //     avatar: 'https://i.pravatar.cc/300',
  //     username: 'user1',
  //   },
  //   {
  //     type: 2,
  //     avatar: 'https://i.pravatar.cc/300',
  //     username: 'user2',
  //   },
  //   {
  //     type: 3,
  //     avatar: 'https://i.pravatar.cc/300',
  //     username: 'user3',
  //   },
  //   {
  //     type: 1,
  //     avatar: 'https://i.pravatar.cc/300',
  //     username: 'user4',
  //   }
  // ]
  return (
    <div className="notif-content">
      <h3 className="text-lg tracking-wider font-semibold absolute top-4">
        Notifications
      </h3>
      <div className="notif-list mt-4">
        {gameRequest.map((item: any, index: any) => (
          <NotifItem key={index} data={item} />
        ))}
      </div>
    </div>
  );
}
