"use client";

import SideBar from "@/components/LoggedUser/SideBar/SideBar";
import React, { useEffect, useState } from "react";
import "./style.scss";
import {
  baseChatUrl,
  baseUrlUsers,
  getRequest,
} from "@/app/context/utils/service";
import Channels from "./components/Channels";
import BoxChat from "./components/BoxChat";
import Friends from "./components/Friends";
import { blockedUsers, channel, channels } from "@/interfaces/channels";
import { Message, chat } from "@/interfaces/ChatTypes";
import io, { Socket } from "socket.io-client";
import { useCookies } from "react-cookie";

const Chat: React.FC = () => {
  /// create useState Where you can get blocked users && update it when the users is blocked from chat
  /// the resposne from back end is the username of the blocked user
  const [blockedUsers, setBlockedUsers] = useState<blockedUsers[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<channel>(); // to set the channel selected
  const [selectedChat, setSelectedChat] = useState<chat>(); // to set the user selected
  //TODO:create type for channles already exists
  const [messages, setMessages] = useState<Message[]>([]);
  const [channels, setChannels] = useState<channels[]>([]); // to set channels already exists
  const [users, setUsers] = useState([]); // to set users (TODO : changing it to user friends)
  const [cookie] = useCookies(["access_token"]);
  // GET all users
  let socket: Socket;
  useEffect(() => {
    (async () => {
      const response = await getRequest(`${baseUrlUsers}/users`);
      setUsers(response);
    })();
    (async () => {
      const response = await getRequest(`${baseUrlUsers}/blockedUsers`);
      setBlockedUsers(response)
    })();
  }, []);
  // testing socket in root chat page
  // socket = io("http://127.0.0.1:8080/chat", {
  //   auth: {
  //     token: cookie.access_token,
  //   },
  // });
  // socket.on("connected", (messageInfo: Message) =>
  // {

  // })
  // GET all channels already created
  useEffect(() => {
    (async () => {
      try {
        const responseDm = await getRequest(`${baseChatUrl}/channelsDm`); // fetching USER Dms
        setChannels(responseDm);
        console.log("reposne form ge channles", responseDm);

        const responseRooms = await getRequest(`${baseChatUrl}/channelsRooms`); // fetching user rooms
        setChannels((prevchannels: any) => [...prevchannels, ...responseRooms]);
      } catch (error) {}
    })();
  }, []);

  // TODO :?  --- GET CONNECTED USER FRIENDS
  const [isExpanded, setIsExpanded] = React.useState<boolean>(false);
  return (
    <div className="logged-user">
      <SideBar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      <div className="home">
        <div className="chat-page">
          <h2 className="text-2xl text-white mx-auto my-4">
            <strong>Chat</strong>
          </h2>
          <div className="container">
            <Channels
              setMessages={setMessages}
              channels={channels}
              setSelectedChannel={setSelectedChannel}
              setSelectedChat={setSelectedChat}
            />
            {selectedChannel && (
              <BoxChat
                blockedUsers={blockedUsers}
                setBlockedUsers={setBlockedUsers}
                setMessages={setMessages}
                messages={messages}
                channels={channels}
                selectedChannel={selectedChannel}
                selectedChat={selectedChat}
                setChannels={setChannels}
                users={users}
              />
            )}
            <Friends
              setSelectedChannel={setSelectedChannel}
              setSelectedChat={setSelectedChat}
              users={users}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
