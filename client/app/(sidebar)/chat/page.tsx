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
import { socketResponse } from "@/interfaces/socketResponse";

let socket: Socket;
const Chat: React.FC = () => {
  const [selectedChannel, setSelectedChannel] = useState<any>(); // to set the channel selected
  const [selectedChat, setSelectedChat] = useState<chat>(); // to set the user selected
  const [messages, setMessages] = useState<Message[]>([]);
  const [channels, setChannels] = useState<channels[]>([]); // to set channels already exists
  const [users, setUsers] = useState([]); // to set users (TODO : changing it to user friends)
  const [cookie] = useCookies(["access_token"]);
  useEffect(() => {
    (async () => {
      const response = await getRequest(`${baseUrlUsers}/users`);
      setUsers(response);
    })();
  }, []);
  // testing socket in root chat page
  // GET all channels already created
  useEffect(() => {
    (async () => {
      try {
        const responseDm = await getRequest(`${baseChatUrl}/channelsDm`); // fetching USER Dms
        setChannels(responseDm);
        const responseRooms = await getRequest(`${baseChatUrl}/channelsRooms`); // fetching user rooms
        setChannels((prevchannels: any) => [...prevchannels, ...responseRooms]);
      } catch (error) {}
    })();
  }, []);
  useEffect(() => {
    socket = io("http://127.0.0.1:8080/chat", {
      auth: {
        token: cookie.access_token,
      },
    });
    socket.on("connected", () => {
      console.log("socket connected");
      socket.on("lastMessage", (messageInfo: any) => {
        let checker = false;
        let updatedChannel : any = channels.filter((channel: any) => {
          if (
            channel.channel &&
            channel.channel.id === messageInfo.channel.id
          ) {
            checker = true;
            channel.channel.message = messageInfo.channel.message;
            return channel;
          }
        });
        let previousChannels =
          channels.filter((channel: any) => {
            return (
              channel.channel && channel.channel.id != messageInfo.channel.id
            );
          })
        console.log("updated channel", updatedChannel , previousChannels);
        !checker
          ? setChannels((prevChannels: any) => [messageInfo, ...prevChannels])
          : setChannels(() => [...updatedChannel, ...previousChannels]);
      });

      socket.on("channelDeleted", (data: socketResponse) => {
        if (!data.success) {
          alert(data.error);
          // error in data.error
        }
        let updatedChannel = channels.map((channel: any) => {
          if (channel.channel.id === data.channelId) return [];
          return channel;
        });
        // if (selectedChannel  && selectedChannel.channel && selectedChannel?.channel.id === channelId) // NOT WORKING AS EXCPCTEDDD
        // setSelectedChannel(); // the  the channel here for other usersss
        setChannels(updatedChannel);
      });
      socket.on("leftRoom", () => {
        // handle the response from socket server
      });
    });
    return () => {
      socket.disconnect();
    };
  }, [channels]);

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
                setSelectedChannel={setSelectedChannel}
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
