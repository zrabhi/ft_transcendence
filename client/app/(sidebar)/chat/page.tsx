"use client";

import SideBar from "@/components/LoggedUser/SideBar/SideBar";
import React, { useContext, useEffect, useState } from "react";
import "./style.scss";
import {
  baseChatUrl,
  baseUrlUsers,
  getRequest,
  putRequest,
} from "@/app/context/utils/service";
import Channels from "./components/Channels";
import BoxChat from "./components/BoxChat";
import Friends from "./components/Friends";
import { channels } from "@/interfaces/channels";
import { Message, chat } from "@/interfaces/ChatTypes";
import io, { Socket } from "socket.io-client";
import { useCookies } from "react-cookie";
import { socketResponse } from "@/interfaces/socketResponse";
import HeaderBar from "@/components/LoggedUser/Profile/HeaderBar/HeaderBar";
import { AiOutlineClose, AiOutlineKey } from "react-icons/ai";
import { array } from "yup";
import { AuthContext } from "@/app/context/AuthContext";
import Modal from "react-modal";
import { showSnackbar } from "@/app/context/utils/showSnackBar";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "400px",
    maxWidth: "500px",
    height: "200px",
    maxHeight: "200px",
  },
};

// when adding notification we must add the  message sended by  the user in last messages
let socket: Socket;
const Chat: React.FC = () => {
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<any>(null); // to set the channel selected
  const [selectedChat, setSelectedChat] = useState<chat>(); // to set the user selected
  const [messages, setMessages] = useState<Message[]>([]);
  const [channels, setChannels] = useState<channels[]>([]); // to set channels already exists
  const [otherChannels, setOtherChannels] = useState([]);
  const [users, setUsers] = useState([]); // to set users (TODO : changing it to user friends)
  const { user } = useContext(AuthContext);
  const [cookie] = useCookies(["access_token"]);

  const [password, setPassword] = useState("");
  const [selectedJoinChannel, setSelectedJoinChannel] = useState<any>(null);

  // just an example of how to use this function
  // it will disapear after 3 sec
  useEffect(() => {
    showSnackbar("TEST", false);
    showSnackbar("Connected", true);
  }, []);

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
      // TODO: need to be in one request => /channels
      try {
        const responseDm = await getRequest(`${baseChatUrl}/channelsDm`); // fetching USER Dms
        setChannels(responseDm);
        const responseRooms = await getRequest(`${baseChatUrl}/channelsRooms`); // fetching user rooms
        setChannels((prevchannels: any) => [...prevchannels, ...responseRooms]);
      } catch (error) {}
    })();
    (async () => {
      const reponse = await getRequest(`${baseChatUrl}/getChannels`);
      setOtherChannels(reponse);
    })();
  }, []);
  useEffect(() => {
    socket = io("http://127.0.0.1:8080/chat", {
      auth: {
        token: cookie.access_token,
      },
    });
    socket.on("connected", () => {
      socket.on("lastMessage", (messageInfo: any) => {
        let checker = false;
        let updatedChannel: any = channels.filter((channel: any) => {
          if (
            channel?.channel &&
            channel?.channel?.id === messageInfo?.channel?.id
          ) {
            checker = true;
            channel.channel.message = messageInfo?.channel?.message;
            return channel;
          }
        });
        let previousChannels = channels.filter((channel: any) => {
          return (
            channel?.channel && channel?.channel?.id != messageInfo?.channel?.id
          );
        });
        !checker
          ? setChannels((prevChannels: any) => [messageInfo, ...prevChannels])
          : setChannels(() => [...updatedChannel, ...previousChannels]);
        if (user.username != messageInfo?.channel?.username)
          showSnackbar(
            `You have new message from ${messageInfo?.channel?.username}`,
            true
          );
      });

      socket.on("channelDeleted", (data: socketResponse) => {
        if (!data.success) {
          alert(data.error);
          return;
        }
        let updatedChannel = channels.map((channel: any) => {
          if (channel.channel && channel.channel.id === data.channelId)
            return [];
          return channel;
        });
        if (user.username != data.username)
          showSnackbar(
            `the owner  ${data.username}  deleted  ${data.name} Room`,
            true
          );
        else
          showSnackbar(`Room has been deleted`, true)
        setSelectedChannel(null); // the  the channel here for other usersss
        setChannels(updatedChannel);
      });
      socket.on("memberJoinned", (data: any) => {
        console.log("data from socket", data);
        if (user.username != data.name) {
          showSnackbar(`${data.name} joinned ${data.channelName} Room`, true);
          if (
            selectedChannel &&
            selectedChannel?.channel &&
            selectedChannel?.channel.id === data.channelId
          ) {
            selectedChannel?.members.push({
              id: data.id,
              name: data.name,
              status: data.status,
              avatar: data.avatar,
              role: data.role,
            });
          }
          return;
        }
        let desiredChannel: any = otherChannels.filter((channel: any) => {
          return channel.channel.id === data.channelId;
        });
        desiredChannel[0]?.members.push({
          id: desiredChannel[0]?.members.length,
          name: user.username,
          avatar: user.avatar,
          role: "Member",
        });
        setSelectedChannel(desiredChannel[0]);
        setSelectedChat(desiredChannel[0]?.channel);
        let NewOtherChahnnels = otherChannels.filter((channel: any) => {
          return channel.channel.id != data.channelId;
        });
        showSnackbar(
          `${data.name} you have successfully joined ${data.channelName}`,
          true
        );
        setOtherChannels(NewOtherChahnnels);
      });
      socket.on("newAdmin", (data: any) => {
        console.log("data from socket", data);
        if (user.username === data.user)
          showSnackbar(`Your now admin of ${data.channelName} Room `, true)
        if (
          selectedChannel &&
          selectedChannel?.channel &&
          selectedChannel?.channel?.name === data.channelName
        ){
          let previousChannel = selectedChannel;
          previousChannel?.members.map((member :any) => {
            if (member.name === data.user)
            {
              console.log("----+++", member);

                member.role ="Admin"
                console.log("Nooww , ----+++", member);
            }
            // return member
          })
          setSelectedChannel(previousChannel)
        }
        showSnackbar(`${data.user} is now admin of ${data.channelName}`, true)
      });
      socket.on("NewMember", (data: any) => {
        if (data.member === user.username)
          setChannels((prevChannels: any) => [
            data.lastMessage,
            ...prevChannels,
          ]);
        else {
          showSnackbar(
            `${data.member} is now in ${data?.channelName} room`,
            true
          );
          let updatedSelectedChannel = selectedChannel;
          updatedSelectedChannel?.members.push({
            name: data.member,
            role: data.role,
            status: data.status,
            avatar: data.avatar,
            id: data.id,
          });
          setSelectedChannel(updatedSelectedChannel);
        }
      });
      socket.on("leftRoom", (data: any) => {
        if (user?.username != data?.name)
          showSnackbar(`${data?.name} left ${data.channelName} Room`, true);
        if (
          selectedChannel &&
          selectedChannel.channel &&
          selectedChannel.channel.id === data.id
        ) {
          let updatedMembers = selectedChannel.members.filter((member: any) => {
            return member.name != data.name;
          });
          setSelectedChannel((prevChannel: any) => ({
            ...prevChannel,
            members: updatedMembers,
          }));
        }
      });
      socket.on("disconnect", () => {
        socket.off("latMessage");
      });
    });
    return () => {
      // socket.off("latMessage");
      socket.disconnect();
    };
  }, [socket]);

  const handleJoinChannel = async (
    e: any,
    channelName: string,
    password: string
  ) => {
    e.preventDefault();
    // let password = "fdf";
    console.log("channel name", channelName, password);

    socket.emit("joinNewChannel", {
      channelName: channelName,
      password: password,
      token: cookie.access_token,
    });

    setSelectedJoinChannel(null);
    setPassword("");
    setOpenPasswordModal(false);
    // const response = await putRequest(`${baseChatUrl}/joinroom/${channelName}/${password}`,
    //   ""
    // );
    // if (response?.channel === undefined) {
    //   // error heree
    // } else {
    //   let desiredChannel :any = otherChannels.filter((channel: any) => {
    //     return channel.channel.id === response.channel.id;
    //   });
    //   desiredChannel[0]?.members.push({
    //     id:desiredChannel[0]?.members.length,
    //     name: user.username,
    //     avatar:user.avatar,
    //     role:"Member"
    //   });
    //   console.log(desiredChannel);
    //   setSelectedChannel(desiredChannel[0]);
    //   setSelectedChat(desiredChannel[0]?.channel)
  };
  // TODO :?  --- GET CONNECTED USER FRIENDS
  const [isExpanded, setIsExpanded] = React.useState<boolean>(false);
  // add header bar to work in notification
  return (
    <div className="logged-user">
      <SideBar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      <div className="home">
        {/* <HeaderBar /> */}
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
            {selectedChannel ? (
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
            ) : (
              <div className="text-white text-xl flex justify-center items-center">
                {" "}
                You need to select a chat!{" "}
              </div>
            )}
            {otherChannels && otherChannels.length > 0 ? (
              <div className="flex flex-col justify-start items-center">
                <h2 className="text-2xl mx-auto my-4 text-white font-semibold">
                  <strong>channels</strong>
                </h2>
                <div
                  className="flex flex-col mx-4 max-h-600px overflow-y-auto"
                  style={{ width: "350px", maxWidth: "350px", height: "600px" }}
                >
                  {otherChannels.map((channel: any) => (
                    <div className="w-full p-4" key={channel.channel?.id}>
                      <div className="flex items-center content-center justify-between bg-[#050A30] rounded-3xl text-white shadow-lg p-4">
                        <div className="flex items-center relative">
                          <img
                            src={channel?.channel?.avatar}
                            alt={channel?.channel?.name}
                            className="avatar mr-2"
                          />
                          <h3 className="text-lg font-semibold text-center">
                            {channel?.channel?.name}
                          </h3>
                        </div>
                        {/* TODO: onclick if its protected a popup will show up to type password */}
                        <button
                          onClick={(e) => {
                            if (channel.channel.type === "PROTECTED") {
                              setOpenPasswordModal(true);
                              setSelectedJoinChannel(channel);
                            } else {
                              handleJoinChannel(
                                e,
                                channel.channel.name,
                                password
                              );
                            }
                          }}
                          className="flex justify-between items-center gap-1 bg-[#654795]  text-white font-semibold py-2 px-4 rounded-3xl focus:outline-none"
                        >
                          Join{" "}
                          {channel.channel?.type === "PROTECTED" && (
                            <AiOutlineKey />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                  <Modal
                    isOpen={openPasswordModal}
                    style={customStyles}
                    contentLabel="Modal"
                  >
                    <div className="flex justify-between items-center mb-3 z-10">
                      <h2 className="font-bold">
                        Write the password of #
                        {selectedJoinChannel?.channel?.name}
                      </h2>
                      <AiOutlineClose
                        className={"cursor-pointer"}
                        onClick={() => {
                          // setAvatarPreview(null);
                          setOpenPasswordModal(false);
                        }}
                      />
                    </div>
                    <hr className="h-1 mx-auto bg-[#654795] border-0 rounded my-8 dark:bg-gray-700" />
                    <div className="flex justify-between items-baseline gap-1 content-center w-full">
                      <input
                        type="password"
                        placeholder="Type Password..."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className=" flex p-3 pl-10 text-xl text-white mb-2 rounded-3xl bg-[#1F1F1F] focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                      <button
                        type="button"
                        className="gap-1 bg-[#654795]  text-white font-semibold py-2 px-4 rounded-3xl focus:outline-none"
                        onClick={(e) =>
                          handleJoinChannel(
                            e,
                            selectedJoinChannel?.channel?.name,
                            password
                          )
                        }
                      >
                        Valid
                      </button>
                    </div>
                  </Modal>
                </div>
              </div>
            ) : (
              <div className="text-white text-xl flex flex-col justify-center items-center">
                {" "}
                <h2>There is no channels to join,</h2>
                <h2>Try to create one!</h2>{" "}
              </div>
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
