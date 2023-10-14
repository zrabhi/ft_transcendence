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
import ConversationPana from "@/public/images/Conversation-pana.png"
import GroupChat from "@/public/images/Group Chat-amico.png"
import Snackbar from "./components/MultipleBar";


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

let socket: Socket;
const Chat: React.FC = () => {
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<any>(null); // to set the channel selected
  const [selectedChat, setSelectedChat] = useState<chat>(); // to set the user selected
  const [messages, setMessages] = useState<Message[]>([]);
  const [channels, setChannels] = useState<channels[]>([]); // to set channels already exists
  const [otherChannels, setOtherChannels] = useState([]);
  const [users, setUsers] = useState([]); // to set users (TODO : changing it to user friends)
  const {
    user,
    setBlockedUsers,
    setUserBlockedMe,
    blockedUsers,
    userBlockedMe,
    friendsList
  } = useContext(AuthContext);
  const [cookie] = useCookies(["access_token"]);
  const [snackbars, setSnackbars] = useState<any>([]);
  const [password, setPassword] = useState("");
  const [selectedJoinChannel, setSelectedJoinChannel] = useState<any>(null);

  const handleOpenSnackbar = (message: any, type: any) => {
    setSnackbars((prevSnackbars: any) => [
      ...prevSnackbars,
      {
        key: new Date().getTime(), // Unique key
        message,
        open: true,
        type:type
      },
    ]);
  };
  const handleCloseSnackbar = (uniqueKey: any) => {
    setSnackbars((prevSnackbars: any) =>
      prevSnackbars.map((snackbar: any) =>
        snackbar.key === uniqueKey ? { ...snackbar, open: false } : snackbar
      )
    );
  };
  // just an example of how to use this function
  // it will disapear after 5 sec
  useEffect(() => {
    showSnackbar("Connected", true);
  }, []);

  useEffect(() => {
    try{
    (async () => {
      const response = await getRequest(`${baseUrlUsers}/user/friends`);
      if (response?.error && response?.message === "Unauthorized"){
        showSnackbar("Unauthorized", false)
        return ;
    }
        setUsers(response);
    })();
  }catch(err)
  {

  }
  }, [friendsList]);

  useEffect(() => {
    try{
    (async () => {
      // TODO: need to be in one request => /channels
      try {
        const responseDm = await getRequest(`${baseChatUrl}/channelsDm`); // fetching USER Dms
        if (responseDm.error){
          if (responseDm.message === "Unauthorized")
            showSnackbar("Unauthorized", false)
        return ;
      }
        setChannels(responseDm);
        const responseRooms = await getRequest(`${baseChatUrl}/channelsRooms`); // fetching user rooms
        if (responseRooms.error){
          if (responseRooms.message === "Unauthorized")
            showSnackbar("Unauthorized", false)
        return ;
       }
        setChannels((prevchannels: any) => [...prevchannels, ...responseRooms]);
      } catch (error) {}
    })();
    (async () => {
      const response = await getRequest(`${baseChatUrl}/getChannels`);
      if (response?.error && response?.message === "Unauthorized"){
        showSnackbar("Unauthorized", false)
        return ;
      }
        setOtherChannels(response);
    })();
  }catch (err) {
  }
  }, []);
  const checkBlocked = (username: string) => {
    return (
      blockedUsers.some((friend: any) => friend === username) ||
      userBlockedMe.some((friend: any) => friend === username)
    );
  };
  useEffect(() => {
    socket = io("http://127.0.0.1:8080/chat", {
      auth: {
        token: cookie.access_token,
      },
    });
    socket.on("connected", () => {
      socket.on("lastMessage", (messageInfo: any) => {
        let checker = false;
        let updatedChannel: any = channels?.filter((channel: any) => {
          if (
            channel?.channel &&
            channel?.channel?.id === messageInfo?.channel?.id
          ) {
            checker = true; /// check if user in blocked user
            if (!checkBlocked(messageInfo?.channel.sender))
                channel.channel.message = messageInfo?.channel?.message;
            else
                channel.channel.message = "this message is hidden"
            return channel;
          }
        });
        let previousChannels = channels?.filter((channel: any) => {
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
        let updatedChannel = channels?.map((channel: any) => {
          if (channel?.channel && channel?.channel?.id === data.channelId)
            return [];
          return channel;
        });
        if (user.username != data.username)
          showSnackbar(
            `the owner  ${data.username}  deleted  ${data.name} Room`,
            true
          );
        else showSnackbar(`Room has been deleted`, true);
        setSelectedChannel(null); // the  the channel here for other usersss
        setChannels(updatedChannel);
      });
      socket.on("userKicked", (data: any) => {
        if (
          selectedChannel &&
          selectedChannel?.channel &&
          selectedChannel?.channel.id === data.channelId
        ) {
          let updatedMembers = selectedChannel?.members?.filter((member: any) => {
            return member.name != data.name;
          });
          setSelectedChannel((prevChannel: any) => ({
            ...prevChannel,
            members: updatedMembers,
          }));
        }
        showSnackbar(
          `${data.name} has been kicked from ${data.channelName} Room`,
          true
        );
      });
      socket.on("yourKicked", (data: any) => {
        if (user.username === data.name) {
          let updatedChannels = channels?.map((channel: any) => {
            if (channel?.channel && channel?.channel.id === data.channelId)
              return [];
            return channel;
          });
          setSelectedChannel(null);
          setChannels(updatedChannels);
          showSnackbar(
            `${data.name} you have been kicked from ${data.channelName}`,
            false
          );
        }
      });

      socket.on("userBanned", (data: any) => {
        // TODO:added user to the banned list (in show mmebers) (Selectedchannel.bannedUsers)
        if (
          selectedChannel &&
          selectedChannel?.channel &&
          selectedChannel?.channel?.id === data.channelId
        ) {
          let updatedMembers = selectedChannel?.members?.filter((member: any) => {
            return member.name != data.name;
          });
          setSelectedChannel((prevChannel: any) => ({
            ...prevChannel,
            members: updatedMembers,
          }));
        }
        showSnackbar(
          `${data.name} has been banned from ${data.channelName} Room`,
          true
        );
      });
      socket.on("yourBanned", (data: any) => {
        if (user.username === data.name) {
          let updatedChannels = channels?.map((channel: any) => {
            if (channel?.channel && channel?.channel?.id === data?.channelId)
              return [];
            return channel;
          });
          setSelectedChannel(null);
          setChannels(updatedChannels);
          showSnackbar(
            `${data.name} you have been banned from ${data?.channelName}`,
            false
          );
        }
      });
      socket.on("userMuted", (data: any) => {
        if (user?.username === data?.user)
          showSnackbar(
            `${data?.user} you have mutued from ${data?.channelName}`,
            true
          );
        else showSnackbar(`${data?.user} is muted`, true);
      });
      socket.on("Yourmuted", (data: any) => {
        showSnackbar(`Message can be sent because you have been muted`, false);
      });
      socket.on("memberJoinned", (data: any) => {
        console.log("data from socket", data);
        if (user.username != data.name) {
          showSnackbar(`${data?.name} joinned ${data?.channelName} Room`, true);
          if (
            selectedChannel &&
            selectedChannel?.channel &&
            selectedChannel?.channel?.id === data.channelId
          ) {
            selectedChannel?.members?.push({
              id: data.id,
              name: data.name,
              status: data.status,
              avatar: data.avatar,
              role: data.role,
            });
          }
          return;
        }
        setChannels((prev: any) => [data?.lastMessage, ...prev]);
        let desiredChannel: any = otherChannels?.filter((channel: any) => {
          return channel?.channel?.id === data?.channelId;
        });
        desiredChannel[0]?.members?.push({
          id: desiredChannel[0]?.members.length,
          name: user.username,
          avatar: user.avatar,
          role: "Member",
        });
        setSelectedChannel(desiredChannel[0]);
        setSelectedChat(desiredChannel[0]?.channel);
        let NewOtherChahnnels = otherChannels?.filter((channel: any) => {
          return channel.channel.id != data.channelId;
        });
        setOtherChannels(NewOtherChahnnels);
        showSnackbar(
          `${data?.name} you have successfully joined ${data?.channelName}`,
          true
        );
      });
      socket.on("newAdmin", (data: any) => {
        console.log("data from socket", data);
        if (user.username === data?.user)
          showSnackbar(`Your now admin of ${data?.channelName} Room `, true);
        if (
          selectedChannel &&
          selectedChannel?.channel &&
          selectedChannel?.channel?.name === data?.channelName
        ) {
          let previousChannel = selectedChannel;
          previousChannel?.members?.map((member: any) => {
            if (member.name === data.user) member.role = "Admin";
          });
          setSelectedChannel(previousChannel);
        }
        showSnackbar(`${data.user} is now admin of ${data.channelName}`, true);
      });
      socket.on("NewMember", (data: any) => {
        if (data.member === user.username) {
            setChannels((prevChannels: any) => [
              data.lastMessage,
              ...prevChannels,
            ]);
          } else {
            handleOpenSnackbar(`${data.member} is now in ${data?.channelName} room`, "success");
          let updatedSelectedChannel = selectedChannel;
          updatedSelectedChannel?.members?.push({
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
          selectedChannel?.channel &&
          selectedChannel?.channel?.id === data.id
        ) {
          let updatedMembers = selectedChannel?.members?.filter((member: any) => {
            return member.name != data.name;
          });
          setSelectedChannel((prevChannel: any) => ({
            ...prevChannel,
            members: updatedMembers,
          }));
        }
      });
      socket.on("blockedUser", () => {
        showSnackbar("you cant send message to user who blocked you", false);
      });
      socket.on("messageBlocked", () => {
        showSnackbar("you cant send message to blocked user", false);
      });
      socket.on("yourBlocked", (data: any) => {
        if (data?.username) {
          setUserBlockedMe((prev: any) => [...prev, data.username]);
          showSnackbar(`${data.username} blocked you`, false);
        }
      });
      socket.on("userBlocked", (data: any) => {
        if (data?.username) {
          showSnackbar(`you've successfully blocked ${data.username}`, true);
          setBlockedUsers((prev: any) => [...prev, data.username]);
        }
      });

      socket.on("userUnBlocked", (data: any) => {
        showSnackbar(`you unblocked ${data.username}`, true);
        let UpdateBlockedUsers = blockedUsers?.filter(
          (member: any) => member != data.username
        );
        setBlockedUsers(UpdateBlockedUsers);
      });
      socket.on("yourUnBlocked", (data: any) => {
        showSnackbar(`${data.username} just unblocked you`, true);
        let UpdateUsersBlockedMe = userBlockedMe?.filter(
          (member: any) => member != data.username
        );
        setUserBlockedMe(UpdateUsersBlockedMe);
      });
      socket.on("UserUnbanned", (data: any) => {
        if (user.username != data.username) {
          if (
            selectedChannel &&
            selectedChannel?.channel &&
            selectedChannel?.channel?.id === data.id
          ) {
            let updatedBannedMembers = selectedChannel?.bannedUsers?.filter(
              (member: any) => {
                return member.name != data.username;
              }
            );
            setSelectedChannel((prevChannel: any) => ({
              ...prevChannel,
              bannedUsers: updatedBannedMembers,
            }));
          }
        } else
          showSnackbar(
            `The owner of ${data.channelName} room just unbanned you`,
            true
          );
      });
      socket.on("disconnect", () => {
        socket.off("YourUnbanned");
        socket.off("lastMessage");
        socket.off("YourBlocked");
        socket.off("userBlocked");
        socket.off("blockedUser");
        socket.off("leftRoom");
        socket.off("NewMember");
        socket.off("newAdmin");
        socket.off("memberJoinned");
        socket.off("userMuted");
        socket.off("Yourmuted");
        socket.off("yourBanned");
        socket.off("userBanned");
        socket.off("yourKicked");
        socket.off("userKicked");
        socket.off("channelDeleted");
      });
    });
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const handleJoinChannel = async (
    e: any,
    channelName: string,
    password: string
  ) => {
    e.preventDefault();
    socket.emit("joinNewChannel", {
      channelName: channelName,
      password: password,
      token: cookie.access_token,
    });
    setSelectedJoinChannel(null);
    setPassword("");
    setOpenPasswordModal(false);
  };
  // TODO :?  --- GET CONNECTED USER FRIENDS
  const [isExpanded, setIsExpanded] = React.useState<boolean>(false);
  // add header bar to work in notification
  return (
    <div className="logged-user">
      <SideBar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      <div className="headerBar">
        <HeaderBar data={user} />
      </div>
      <div className="home">
        <div className="chat-page">
          <h2 className="text-2xl text-white mx-auto my-4">
            <strong>Chat</strong>
          </h2>
          <div className="container">
            <Channels
              setMessages={setMessages}
              channels={channels}
              setChannels={setChannels}
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
              <div className="pt-20 text-[#999999] text-xl flex flex-col justify-start items-start">
                {/* <img src={ConversationPana} alt='ConversationPana'/> */}
                <span>You need to select a chat to start a conversation</span>
                <img src={ConversationPana.src} alt="Conversation Pana" width="500px" height="500px" /> 
              </div>
            )}
            {otherChannels && otherChannels.length > 0 ? (
              <div className="flex flex-col justify-start items-center pt-20">
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
              <div className="pt-20 text-[#999999] text-xl flex flex-col justify-start items-start">
                {" "}
                <h2>There is no channels to join,</h2>
                <h2>Try to create one!</h2>{" "}
                <img src={GroupChat.src} alt='GroupChat' width="500px" height="500px" />
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
      {snackbars.map((snackbar:any) => (
  <Snackbar
    key={snackbar.key}
    uniqueKey={snackbar.key}
    message={snackbar.message}
    open={snackbar.open}
    type={snackbar.type}
    onClose={handleCloseSnackbar}
  />
))}
    </div>
  );
};

export default Chat;
