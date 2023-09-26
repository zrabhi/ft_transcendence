import {
  baseChatUrl,
  getRequest,
  getRequestBody,
  postRequest,
} from "@/app/context/utils/service";
import { Key, useContext, useEffect, useRef, useState } from "react";

import { BsFillSendFill, BsThreeDotsVertical } from "react-icons/Bs";
import { FaUserFriends } from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import { MdAdminPanelSettings } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";

import { User } from "../UserCard";
import io, { Socket } from "socket.io-client";
import { useCookies } from "react-cookie";
import { Message } from "@/interfaces/ChatTypes";
import { AuthContext } from "@/app/context/AuthContext";
import Modal from "react-modal";
Modal.setAppElement("div");
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "500px",
    maxWidth: "500px",
    height: "600px",
    maxHeight: "600px",
  },
};
interface MessageProps {
  reciever?: string;
  sender?: string;
  avatar: string;
  content: string;
}

interface CheckboxesState {
  owner: boolean;
  admins: boolean;
  members: boolean;
}

let socket: Socket;
const BoxChat = ({
  selectedChat,
  setMessages,
  messages,
  selectedChannel,
  setChannels,
  channels,
}: any): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // state for dropdown
  const [isPopupOpen, setIsPopupOpen] = useState(false); // state for members popup
  const [checkboxes, setCheckboxes] = useState<CheckboxesState>({
    owner: true,
    admins: true,
    members: true,
  });

  // if you wanna test this with backend please remove this state and pass a prop called selectedChannel
  // const [selectedChannel, setSelectedChannel] = useState({
  //   type: "room",
  //   members: [
  //     {
  //       id: 1,
  //       name: "User 1",
  //       role: "Owner",
  //       avatar: "https://via.placeholder.com/150",
  //       status: "Online",
  //     },
  //     {
  //       id: 2,
  //       name: "User 2",
  //       role: "Admin",
  //       avatar: "https://via.placeholder.com/150",
  //       status: "Online",
  //     },
  //     {
  //       id: 3,
  //       name: "User 3",
  //       role: "Member",
  //       avatar: "https://via.placeholder.com/150",
  //       status: "Offline",
  //     },
  //     {
  //       id: 4,
  //       name: "User 4",
  //       role: "Admin",
  //       avatar: "https://via.placeholder.com/150",
  //       status: "Online",
  //     },
  //     {
  //       id: 5,
  //       name: "User 5",
  //       role: "Admin",
  //       avatar: "https://via.placeholder.com/150",
  //       status: "Offline",
  //     },
  //     {
  //       id: 6,
  //       name: "User 6",
  //       role: "Member",
  //       avatar: "https://via.placeholder.com/150",
  //       status: "Online",
  //     },
  //     {
  //       id: 7,
  //       name: "User 7",
  //       role: "Member",
  //       avatar: "https://via.placeholder.com/150",
  //       status: "Offline",
  //     },
  //     {
  //       id: 8,
  //       name: "User 8",
  //       role: "Admin",
  //       avatar: "https://via.placeholder.com/150",
  //       status: "Online",
  //     },
  //     {
  //       id: 9,
  //       name: "User 9",
  //       role: "Member",
  //       avatar: "https://via.placeholder.com/150",
  //       status: "Offline",
  //     },
  //   ],
  // });
  // const [messages, setMessages] = useState<Message[]>([]);
  const [chat, setChat] = useState({}); // id && tyoe && avatar && username && message
  const [cookie] = useCookies(["access_token"]);
  const { user } = useContext(AuthContext);

  const getRoleOptions = (type: string) => {
    if (type === "PUBLIC" || type === "PRIVATE" || type === "PROTECTED") {
      return {
        Owner: [
          { text: "Delete Room", action: handleDeleteRoom },
          { text: "Add member", action: handleAddMember },
          { text: "Show members", action: handleShowMembers },
        ],
        Admin: [
          { text: "Leave Room", action: handleLeaveRoom },
          { text: "Add member", action: handleAddMember },
          { text: "Show members", action: handleShowMembers },
        ],
        Member: [
          { text: "Leave Room", action: handleLeaveRoom },
          { text: "Show members", action: handleShowMembers },
        ],
      };
    } else if (type === "DM") {
      return [
        { text: "Block", action: handleBlock },
        { text: "Show profile", action: handleShowProfile },
      ];
    } else {
      return {}; // Return an empty object for unsupported channel states
    }
  };

  const roleOptions = getRoleOptions(selectedChannel.channel.type);

  function handleBlock() {
    alert("Block action");
  }

  function handleShowProfile() {
    alert("Show profile action");
  }

  const actionOptions = {
    Owner: [
      { text: "Ban", action: handleDeleteRoom },
      { text: "Mute", action: handleAddMember },
      { text: "Set as admin", action: handleShowMembers },
    ],
    Admin: [
      { text: "Ban", action: handleLeaveRoom },
      { text: "Mute", action: handleAddMember },
    ],
  };

  const optionsToShow =
    selectedChannel?.channel.type === "PUBLIC" ||
    selectedChannel?.channel.type === "PROTECTED" ||
    selectedChannel?.channel.type === "PRIVATE"
      ? roleOptions["Owner"]
      : roleOptions || [];

  const separateOptions = optionsToShow.filter(
    (option: any) =>
      option.text === "Delete Room" ||
      option.text === "Leave Room" ||
      option.text === "Block"
  );

  const nonSeparateOptions = optionsToShow.filter(
    (option: any) =>
      option.text !== "Delete Room" &&
      option.text !== "Leave Room" &&
      option.text !== "Block"
  );

  // Action functions
  function handleDeleteRoom() {
    // handle delete room action

    alert("Delete Room action");
  }

  function handleAddMember() {
    // handle add member action
    alert("Add member action");
  }

  function handleShowMembers() {
    setIsPopupOpen(true);
  }

  function handleLeaveRoom() {
    //handle leave room action
    alert("Leave Room action");
  }

  // Function to handle option click
  function handleOptionClick(action: () => void) {
    action(); // Call the corresponding action function
    setIsDropdownOpen(false); // Close the dropdown after clicking an option
  }

  // trying to create socket to connect with other user here
  useEffect(() => {
    console.log("selected channe sis =>", selectedChannel);

    (async () => {
      const response = await getRequest(
        `${baseChatUrl}/getMessages/${selectedChannel?.channel?.id}`
      );
      // NOTICE: THE USERS IN CHANNELS ARE STORED IN response.users
      setMessages(() => []);
      setMessages((prevMessages: any) => [
        ...prevMessages,
        ...response.allMessages,
      ]); //reminderr
      console.log("chat ", selectedChat);
    })();

    setChat(selectedChat);
    socket = io("http://127.0.0.1:8080/chat", {
      auth: {
        token: cookie.access_token,
      },
    });
    socket.on("connected", () => {
      console.table("connected");
      socket.emit("joinChat", { id: selectedChannel.channel.id });

      socket.on("message", (messageInfo: Message) => {
        let sendedMessage: Message = {
          content: messageInfo.content,
          time: messageInfo.time,
        };
        if (user.username != messageInfo.reciever) {
          sendedMessage.sender = messageInfo.reciever;
          sendedMessage.avatar = messageInfo.avatar;
        } else sendedMessage = messageInfo;
        setMessages((prevMessages: any) => [...prevMessages, sendedMessage]);
        let updatedChannel = channels.map((channel: any) => {
          if (channel.channel.id === selectedChannel.channel.id)
            channel.channel.message = sendedMessage.content;
          return channel;
        });
        setChannels(updatedChannel);
      });
    });
    return () => {
      socket.disconnect();
    };
  }, [selectedChannel]);

  useEffect(() => {
    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, []);

  //   // get friends here

  const sendMessage = async () => {
    var time = new Date();
    const body = {
      message: message,
      channelId: selectedChannel.channel.id,
      token: cookie.access_token,
      time: time.getHours() + ":" + time.getMinutes(),
    };
    console.log("socket ", socket);
    socket.emit("message", body);
    setMessage("");
  };

  const handleChange = (e: any) => {
    setMessage(e.target.value);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleChangeCheckbox = (option: keyof CheckboxesState) => {
    setCheckboxes({
      ...checkboxes,
      [option]: !checkboxes[option],
    });
  };
  // Filter users based on selected checkboxes
  const filteredUsers = selectedChannel?.members?.filter((user: any) => {
    if (checkboxes.owner && user.role === "Owner") return true;
    if (checkboxes.admins && user.role === "Admin") return true;
    if (checkboxes.members && user.role === "Member") return true;
    return false;
  });

  filteredUsers.sort((a: any, b: any) => {
    if (a.role === "Owner" && b.role !== "Owner") return -1;
    if (a.role === "Admin" && b.role !== "Owner" && b.role !== "Admin")
      return -1;
    return 1;
  });

  // Define icons for each role
  const roleIcons: Record<string, React.ReactNode> = {
    Owner: <MdAdminPanelSettings className="text-[#FF5555]" />,
    Admin: <RiAdminFill className="text-[#CDD031]" />,
    Member: <FaUserFriends className="text-[#654795]" />,
  };

  const renderActions = (role: string, user: any) => {
    console.log("role user", user);
    if (role in actionOptions) {
      return (
        <div className="mt-2">
          {actionOptions[role].map((option: any, index: Key) => (
            <button
              key={index}
              className={`text-${
                option.text === "Ban"
                  ? "red"
                  : option.text === "Mute"
                  ? "green"
                  : "yellow"
              }-600 hover:text-${
                option.text === "Ban"
                  ? "red"
                  : option.text === "Mute"
                  ? "green"
                  : "yellow"
              }-800 mr-2`}
              onClick={option.action}
            >
              {user.role === "Owner" ||
              (user.role === "Admin" && option.text === "Set as admin")
                ? ""
                : option.text}
            </button>
          ))}
        </div>
      );
    }
    return null; // No actions for invalid roles
  };

  return (
    <div className="box-chat">
      <div className="box-chat-container relative inline-block text-left z-1">
        <User user={chat} />
        <BsThreeDotsVertical
          className="icon cursor-pointer"
          onClick={toggleDropdown}
          id="options-menu"
          aria-haspopup="true"
          aria-expanded="true"
        />
        {/* Options to show here */}
        {isDropdownOpen && (
          <div className="origin-bottom-right absolute right-6 mt-[150px] w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div
              className="py-1"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="options-menu"
            >
              {nonSeparateOptions.map((option, index) => (
                <div
                  key={index}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-300 hover:text-gray-900 font-semibold cursor-pointer"
                  role="menuitem"
                  onClick={() => handleOptionClick(option.action)}
                >
                  {option.text}
                </div>
              ))}
              {separateOptions.length > 0 && (
                <hr className="border-t border-gray-200" />
              )}
              {separateOptions.map((option, index) => (
                <div
                  key={index}
                  className={`block px-4 py-2 text-sm text-red-600 hover:bg-gray-300 hover:text-red-600 font-semibold cursor-pointer`}
                  role="menuitem"
                  onClick={() => handleOptionClick(option.action)}
                >
                  {option.text}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="box-chat-messages">
        <div className="messages-box flex flex-col flex-grow overflow-y-auto justify-end">
          <div className="flex flex-col space-y-2 p-4">
            {messages &&
              messages?.map((message: MessageProps, index: Key) =>
                message.reciever ? (
                  <div
                    className="self-end bg-[#654795] text-white rounded-3xl p-1 flex items-center"
                    key={"index"}
                  >
                    <span className="mr-2">
                      <img
                        alt={message.sender}
                        src={message.avatar}
                        className="avatar-chat"
                        style={{ width: "40px", height: "40px" }}
                      />
                    </span>
                    <div style={{ flex: 1 }}>
                      <p className="ml-2" style={{ wordWrap: "break-word" }}>
                        {message.content}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div
                    className="self-start bg-gray-200 rounded-3xl p-1 flex items-center"
                    key={"index&"}
                  >
                    <span className="mr-4">
                      <img
                        alt={message.reciever}
                        src={message.avatar}
                        className="avatar-chat"
                        style={{ width: "40px", height: "40px" }}
                      />
                    </span>
                    <div style={{ flex: 1 }}>
                      <p className="ml-2" style={{ wordWrap: "break-word" }}>
                        {message.content}
                      </p>
                    </div>
                  </div>
                )
              )}
          </div>
          <div className="p-4 w-full flex justify-end">
            <div className="relative w-full">
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer">
                <BsFillSendFill color={"white"} onClick={sendMessage} />
              </div>
              <input
                type="search"
                id="default-search"
                className="block w-full p-4 pl-10 text-sm text-white rounded-3xl bg-[#1F1F1F] focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Write a message"
                onChange={handleChange}
                value={message}
              />
            </div>
          </div>
          <div ref={ref} />
        </div>
      </div>
      {isPopupOpen && (
        <Modal isOpen={isPopupOpen} style={customStyles} contentLabel="Modal">
          <div className="flex justify-between items-center mb-3 z-10">
            <h2 className="font-bold">Room members</h2>
            <AiOutlineClose
              className={"cursor-pointer"}
              onClick={() => {
                // setAvatarPreview(null);
                setIsPopupOpen(false);
              }}
            />
          </div>
          <hr className="h-1 mx-auto bg-[#654795] border-0 rounded my-8 dark:bg-gray-700" />
          <div>
            <div className="flex justify-between">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="form-checkbox accent-[#654795] h-5 w-5"
                  checked={checkboxes.owner}
                  onChange={() => handleChangeCheckbox("owner")}
                />
                <span className="text-gray-700">Owner</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="form-checkbox accent-[#654795] h-5 w-5"
                  checked={checkboxes.admins}
                  onChange={() => handleChangeCheckbox("admins")}
                />
                <span className="text-gray-700">Admins</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="form-checkbox accent-[#654795] h-5 w-5"
                  checked={checkboxes.members}
                  onChange={() => handleChangeCheckbox("members")}
                />
                <span className="text-gray-700">Members</span>
              </label>
            </div>
            <div>
              {/* Add a scrollable container with a max height */}
              <div className="max-h-500px overflow-y-auto">
                <div className="mt-4">
                  {filteredUsers.map((user: any) => (
                    <div
                      key={user.id}
                      className="bg-[#050A30] shadow-lg rounded-3xl overflow-hidden flex justify-between items-center p-4 mb-4"
                    >
                      <div className="flex flex-row items-center">
                        <div className="relative">
                          <div
                            className={`w-4 h-4 absolute top-2 right-3 rounded-full ${
                              user.status === "Online"
                                ? "bg-green-500"
                                : "bg-gray-500"
                            }`}
                          />
                          <img
                            src={user.avatar}
                            alt={`${user.name}'s avatar`}
                            className="w-16 h-16 object-cover rounded-full mr-4"
                          />
                        </div>
                        <div>
                          <h3 className="text-xl text-white font-semibold">
                            {user.name}
                          </h3>
                          {/* Render the role icon */}
                          <div className="flex items-center">
                            {roleIcons[user.role]}
                            <span
                              className={`ml-2 font-semibold ${
                                user.role === "Owner"
                                  ? "text-[#FF5555]"
                                  : user.role === "Admin"
                                  ? "text-[#CDD031]"
                                  : "text-[#654795]"
                              }`}
                            >
                              {user.role}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        {renderActions("Owner", user)}
                        {/* the "Admin" is the user connected role in this room channel */}
                        {/* it can be "Admin" "Owner" "Member" */}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default BoxChat;
