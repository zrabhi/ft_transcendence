import {
  baseChatUrl,
  baseUrlUsers,
  getRequest,
  putRequest,
} from "@/app/context/utils/service";
import { Key, useContext, useEffect, useRef, useState } from "react";

import { BsFillSendFill, BsThreeDotsVertical } from "react-icons/bs";
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
import { showSnackbar } from "@/app/context/utils/showSnackBar";
import { useRouter } from "next/navigation";
// Modal.setAppElement("div");
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
const customStylesChangeType = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "500px",
    maxWidth: "500px",
    height: "350px",
    maxHeight: "350px",
  },
};
interface MessageProps {
  reciever?: string;
  sender?: string;
  avatar: string;
  content: string;
  blocked?: boolean;
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
  setSelectedChannel,
  setChannels,
  channels,
  users,
}: any): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // state for dropdown
  const [isPopupOpen, setIsPopupOpen] = useState(false); // state for members popup
  const [isChangeTypePopupOpen, setIsChangeTypePopupOpen] = useState(false); // state for members popup

  const [blockOrUnblock, setBlockOrUnblock] = useState("Block");
  const [selectedUsers, setSelectedUsers] = useState<any>([]);
  const [isAddMemberPopupOpen, setIsAddMemberPopupOpen] = useState(false);
  const [checkboxes, setCheckboxes] = useState<CheckboxesState>({
    owner: true,
    admins: true,
    members: true,
  });
  const [currentUserRole, setCurrentUserRole] = useState<
    "Owner" | "Admin" | "Member"
  >("Member");

  const [chat, setChat] = useState<any>(); // id && tyoe && avatar && username && message
  const [cookie] = useCookies(["access_token"]);
  const router = useRouter();

  const { user, blockedUsers, setBlockedUsers, userBlockedMe } =
    useContext(AuthContext);
  const getRoleOptions = (type: string) => {
    if (type === "PUBLIC" || type === "PRIVATE" || type === "PROTECTED") {
      return {
        Owner: [
          { text: "Leave Room", action: handleLeaveRoom },
          { text: "Delete Room", action: handleDeleteRoom },
          { text: "Add member", action: handleAddMember },
          { text: "Show members", action: handleShowMembers },
          { text: "Settings", action: handleChangeChannelType },
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
        { text: "Unblock", action: handleUnblock },
        { text: "Show profile", action: handleShowProfile },
      ];
    } else {
      return {}; // Return an empty object for unsupported channel states
    }
  };

  const roleOptions: any = selectedChannel
    ? getRoleOptions(selectedChannel?.channel?.type)
    : {};

  async function handleBlock() {
    console.log("-----", selectedChat);
    // username is the selected user to be blocked
    socket.emit("block", {
      username: selectedChat.username,
      token: cookie.access_token,
    });
  }
  async function handleUnblock() {
    // username is the selected user to be blocked
    socket.emit("unblock", {
      username: selectedChat.username,
      token: cookie.access_token,
    });
  }

  function handleShowProfile(user: any) {
    router.push(`/profile/${selectedChat.username}`);
  }

  // change it to async
  const actionOptions: any = {
    Owner: [
      { text: "Ban", action: handleBanMember }, // change to handle Ban and username of the banned one must be provided
      { text: "Mute", action: handleMuteMember }, // change to handle Mute
      { text: "Kick", action: handleKickMember }, // change to handle Ban and username of the banned one must be provided
      { text: "Set as admin", action: handleSetAsAdmin }, // change to handle set As ADMIN
    ],
    Admin: [
      { text: "Ban", action: handleBanMember }, // change to handle Ban
      { text: "Mute", action: handleMuteMember }, // change to handle Mute
      { text: "Kick", action: handleKickMember }, // change to handle Ban
    ],
  };

  const optionsToShow =
    selectedChannel?.channel?.type === "PUBLIC" ||
    selectedChannel?.channel?.type === "PROTECTED" ||
    selectedChannel?.channel?.type === "PRIVATE"
      ? roleOptions[currentUserRole]
      : roleOptions || [];

  const separateOptions =
    optionsToShow?.length > 0
      ? optionsToShow?.filter(
          (option: any) =>
            option.text === "Delete Room" ||
            option.text === "Leave Room" ||
            option.text === "Block" ||
            option.text === "Unblock"
        )
      : [];

  const nonSeparateOptions =
    optionsToShow?.length > 0
      ? optionsToShow?.filter(
          (option: any) =>
            option.text !== "Delete Room" &&
            option.text !== "Leave Room" &&
            option.text !== "Block" &&
            option.text !== "Unblock"
        )
      : [];

  // Action functions
  async function handleDeleteRoom() {
    const body = {
      channelId: selectedChannel.channel.id,
      token: cookie.access_token,
    };
    socket.emit("deleteChannel", body);
  }

  function handleAddMember() {
    setIsAddMemberPopupOpen(true);
  }

  function handleChangeChannelType() {
    // setIsAddMemberPopupOpen(true);
    setIsChangeTypePopupOpen(true);
  }

  function handleShowMembers() {
    setIsPopupOpen(true);
  }

  async function handleLeaveRoom() {
    try{
    const response = await putRequest(
      `${baseChatUrl}/leaveChannel/${selectedChannel.channel.id}`,
      ""
    );
    if (response?.error && response?.message === "Unauthorized"){
      showSnackbar("Unauthorized", false)
      return ;
    }
    if (!response.success) {
      showSnackbar(`${response?.message.message}`, false);
      return;
    }
    socket.emit("LeaveChannel", {
      channelId: selectedChannel.channel.id,
      token: cookie.access_token,
      name: user.username,
    });
    let updatedChannels = channels.filter((channel: any) => {
      return channel?.channel?.id != selectedChannel.channel.id;
    });
    setSelectedChannel(null);
    setChannels(updatedChannels);
    showSnackbar("You left the channel successfully", true);
  }catch(err)
  {

  }
  }

  function handleKickMember(user: any) {
    socket.emit("kick", {
      channelId: selectedChannel?.channel?.id,
      username: user?.name,
      token: cookie.access_token,
    });
  }
  function handleBanMember(user: any) {
    socket.emit("ban", {
      channelId: selectedChannel?.channel?.id,
      username: user?.name,
      token: cookie.access_token,
    });
  }

  function handleUnBanMember(user: any) {
    socket.emit("unban", {
      channelId: selectedChannel?.channel?.id,
      username: user?.name,
      token: cookie.access_token,
    });
    showSnackbar("user unbanned successfully", true);
  }

  function handleMuteMember(user: any) {
    socket.emit("mute", {
      channel_id: selectedChannel?.channel?.id,
      username: user?.name,
      token: cookie.access_token,
    });
  }
  async function handleSetAsAdmin(user: any) {
    socket.emit("setAdmin", {
      channelId: selectedChannel?.channel?.id,
      username: user?.name,
      token: cookie.access_token,
    });
  }
  function handleOptionClick(action: () => void) {
    action(); // Call the corresponding action function
    setIsDropdownOpen(false); // Close the dropdown after clicking an option
  }

  const getCurrentUserRole = () => {
    const currentUser = selectedChannel?.members?.find((member: any) => {
      return member.name === user.username;
    });
    setCurrentUserRole(currentUser?.role);
  };
  useEffect(() => {
    getCurrentUserRole();
    setSelectedUsers([]);

    (async () => {
      try{
      const response = await getRequest(
        `${baseChatUrl}/getMessages/${selectedChannel?.channel?.id}`
      );
      if (response?.error){
          if(response?.message === "Unauthorized")
            showSnackbar("Unauthorized", false)
        return ;
    }
      let checkBlocked = response?.allMessages?.filter((message: any) => {
        if (
          userBlockedMe.includes(message?.sender) ||
          blockedUsers.includes(message?.sender)
        )
          (message.blocked = true)
        return message;
      });
      setMessages(() => []);
      setMessages((prevMessages: any) => [...prevMessages, ...checkBlocked]);
    }catch(err)
    {

    }
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
          blocked: false,
        };

        if (user.username != messageInfo.reciever) {
          if (
            blockedUsers.includes(messageInfo.reciever) ||
            userBlockedMe.includes(messageInfo.reciever)
          )
            sendedMessage.blocked = true;
          sendedMessage.sender = messageInfo.reciever;
          sendedMessage.avatar = messageInfo.avatar;
        } else sendedMessage = messageInfo;
        setMessages((prevMessages: any) => [...prevMessages, sendedMessage]);
        return;
      });
      socket.on("Unauthorized", () =>
      {
        showSnackbar("Unauthorized", false);
        router.push("login");
      })
      socket.on("error occored", () =>{
        showSnackbar("Unauthorized", false);
      });
      socket.on("disconnect", () => {
        socket.off("message");
      });
    });
    return () => {
      socket.disconnect();
    };
  }, [selectedChannel]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  //   // get friends here

  const sendMessage = async (e: any) => {
    e.preventDefault(); // prevent from refreshing the chat box component
    if (message && message.length > 0 && !/^\s*$/.test(message)) {
      var time = new Date();
      const body = {
        message: message.trim(),
        channelId: selectedChannel?.channel?.id,
        token: cookie.access_token,
        time: time.getHours() + ":" + time.getMinutes(),
      };
      socket.emit("message", body);

      setMessage("");
    } else {
      showSnackbar("type a valid message", false);
    }
  };

  const handleChange = (e: any) => {
    e.preventDefault();
    if (e.target.value === " ")
        setMessage("");
    else
      setMessage(e.target.value.replace(/\s+/g, " "));
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

  filteredUsers?.sort((a: any, b: any) => {
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

  const renderActions = (role: "Owner" | "Admin" | "Member", user: any) => {
    // console.log("role user", user);
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
                  : option.text === "Kick"
                  ? "red"
                  : "gray"
              }-600 mr-2 text-xs`}
              onClick={() => option.action(user)}
            >
              {(role === "Owner" &&
                user.role === "Admin" &&
                (option.text === "Ban" ||
                  option.text === "Mute" ||
                  option.text === "Kick")) ||
              (user.role === "Member" &&
                (option.text === "Ban" ||
                  option.text === "Kick" ||
                  option.text === "Mute" ||
                  option.text === "Set as admin"))
                ? option.text
                : ""}
            </button>
          ))}
        </div>
      );
    }
    return null; // No actions for invalid roles
  };

  // to handle the invites, i Added this method to invite  multiples users in one invite

  const handleCheckChange = (username: string) => {
    if (selectedUsers.includes(username)) {
      setSelectedUsers(
        selectedUsers.filter((selected: any) => selected !== username)
      );
    } else {
      setSelectedUsers([...selectedUsers, username]);
    }
  };

  const [searchQuery, setSearchQuery] = useState("");

  // this state is to remove the users if theyr already in channel members
  const [usersList, setUsersList] = useState<any>(
   users.length > 0 ? users.filter((user: any) => {
      // Check if the user's id is in the members array
      return (
        !selectedChannel?.members?.some(
          (member: any) => member.name === user.username
        ) &&
        !blockedUsers.includes(user.username) &&
        !userBlockedMe.includes(user.username)
      );
    }): []
  );

  // this state is for the search bar to filter easily
  const [filteredUserList, setFilteredUserList] = useState(usersList);

  // function to fo filter onChange
  const handleSearchInputChange = (e: any) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter users based on the search query
    const filtered = usersList?.filter((user: any) =>
      user.username.toLowerCase().includes(query)
    );

    setFilteredUserList(filtered);
  };

  const InviteUsers = (e: any) => {
    e.preventDefault();
    if (selectedUsers.length === 0) return;
    const data = {
      channelId: selectedChannel.channel.id,
      Users: selectedUsers,
      token: cookie.access_token,
    };
    socket.emit("addMember", data);
  };

  const [activeTab, setActiveTab] = useState("members");

  const handleTabChange = (tab: any) => {
    setActiveTab(tab);
  };

  const [changeType, setChangeType] = useState({
    channelId: selectedChannel?.channel?.id,
    type: selectedChannel?.channel?.type,
    password: "",
  });
  const handleChangeType = (e: any) => {
    setChangeType((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleClickChangeType = async () => {
    try{
    console.log(changeType);
    const response = await putRequest(
      `${baseChatUrl}/channelSettings`,
      JSON.stringify(changeType)
    );
    if (response?.error && response?.message === "Unauthorized"){
      showSnackbar("Unauthorized", false)
      return ;
    }
    if (response?.error) {
      showSnackbar(response?.message.error, false);
    } else showSnackbar(response?.message, true);
  }catch(err)
  {

  }
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
              {nonSeparateOptions?.map((option: any, index: Key) => (
                <div
                  key={"unseparated" + index}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-300 hover:text-gray-900 font-semibold cursor-pointer"
                  role="menuitem"
                  onClick={() => handleOptionClick(option.action)}
                >
                  {option.text}
                </div>
              ))}
              {separateOptions?.length > 0 && (
                <hr className="border-t border-gray-200" />
              )}
              {/* ADD setting here */}
              {separateOptions?.map((option: any, index: Key) => (
                <div key={"keydiv"+index}>
                  {blockedUsers.includes(chat?.username) &&
                    selectedChannel?.channel?.type === "DM" &&
                    option.text === "Unblock" && (
                      <div
                        key={"separated" + index} //changed previous value "index&"
                        className={`block px-4 py-2 text-sm text-red-600 hover:bg-gray-300 hover:text-red-600 font-semibold cursor-pointer`}
                        role="menuitem"
                        onClick={() => handleOptionClick(option.action)}
                      >
                        {option.text}
                      </div>
                    )}
                  {!blockedUsers.includes(chat?.username) &&
                    selectedChannel?.channel?.type === "DM" &&
                    option.text === "Block" && (
                      <div
                        key={"separated1" + index} //changed previous value "index&"
                        className={`block px-4 py-2 text-sm text-red-600 hover:bg-gray-300 hover:text-red-600 font-semibold cursor-pointer`}
                        role="menuitem"
                        onClick={() => handleOptionClick(option.action)}
                      >
                        {option.text}
                      </div>
                    )}
                  {selectedChannel?.channel?.type !== "DM" && (
                    <div
                      key={"separated2" + index} //changed previous value "index&"
                      className={`block px-4 py-2 text-sm text-red-600 hover:bg-gray-300 hover:text-red-600 font-semibold cursor-pointer`}
                      role="menuitem"
                      onClick={() => handleOptionClick(option.action)}
                    >
                      {option.text}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        <Modal
          isOpen={isChangeTypePopupOpen}
          style={customStylesChangeType}
          contentLabel="Modal"
        >
          <div className="flex justify-between items-center mb-3 z-10">
            <h2 className="font-bold">Change Channel Type</h2>
            <AiOutlineClose
              className={"cursor-pointer"}
              onClick={() => {
                // setAvatarPreview(null);
                setIsChangeTypePopupOpen(false);
              }}
            />
          </div>
          <hr className="h-1 mx-auto bg-[#654795] border-0 rounded my-8 dark:bg-gray-700" />
          <div>
            <label htmlFor="type" className="block text-gray-700 font-medium">
              Room Type
            </label>
            <select
              name="type"
              id="type"
              className="border border-gray-300 rounded w-full px-3 py-2 my-2"
              value={changeType.type}
              onChange={(e) => handleChangeType(e)}
            >
              <option value="">Select type of this room</option>
              <option value="PUBLIC">PUBLIC</option>
              <option value="PRIVATE">PRIVATE</option>
              <option value="PROTECTED">PROTECTED</option>
            </select>
          </div>

          {changeType.type === "PROTECTED" && (
            <div>
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Enter your password"
                className="border border-gray-300 rounded w-full px-3 py-2 my-2"
                onChange={(e) => handleChangeType(e)}
                value={changeType.password}
              />
            </div>
          )}
          <button
            type="button"
            className="flex justify-between items-center gap-1 bg-[#654795]  text-white font-semibold py-2 px-4 rounded-3xl focus:outline-none mt-4"
            onClick={handleClickChangeType}
          >
            Valid
          </button>
        </Modal>
      </div>
      <div className="box-chat-messages">
        <div className="messages-box" ref={containerRef}>
          {messages.map((message: Message, index: number) => (
            <div
              key={index}
              className={`py-2 flex flex-row w-full ${
                message.reciever ? "justify-end" : "justify-start"
              }`}
            >
              <div className={`${message.reciever ? "order-2" : "order-1"}`}>
                <img
                  alt={message.reciever ? message.sender : message.reciever}
                  src={message.avatar}
                  className="avatar-chat"
                  style={{ width: "40px", height: "40px" }}
                />
              </div>
              <div
                className={`px-2 w-fit py-3 flex flex-col rounded-3xl  ${
                  message.reciever ? "order-1 mr-2" : "order-2 ml-2"
                } ${message.sender ? "text-white bg-[#4050C8]": "bg-[#F0F0F0] text-black"}`}
                style={{ wordBreak: "break-all" }} // Break words or strings at any character
              >
                {/* <span className="text-xs text-gray-200">
                {message.sentBy}&nbsp;-&nbsp;
                {new Date(message.sentAt).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </span> */}
                <span className="text-md">{!message?.blocked
                        ? message.content
                        : "this message is hidden!"}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="chat-input bg-[#14003D] w-100 overflow-hidden rounded-bl-xl rounded-br-xla">
          <div className=" space-x-5">
            <form onSubmit={sendMessage} className="pl-2 pr-2 gap-3 flex flex-row items-center justify-between">
              <div className="relative w-full">
                <input
                  type="search"
                  id="default-search"
                  className="w-full block p-3 pl-10 text-sm text-white  rounded-3xl bg-[#1F1E1F] focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Write a message"
                  onChange={handleChange}
                  value={message}
                />
              </div>

              <button
                  type="submit"
                  className="px-3 py-2 text-xs font-medium text-center text-white bg-[#654695] rounded-3xl hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 disabled:opacity-50"
                  
                  disabled={!message || message.length === 0}
                >
                  Send
              </button>
            </form>
          </div>
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
          <div className="flex space-x-4 items-center justify-center mb-4">
            <button
              onClick={() => handleTabChange("members")}
              className={`${
                activeTab === "members"
                  ? "bg-[#4B356F] text-white"
                  : "bg-gray-200 text-gray-600"
              } py-2 px-4 rounded-md focus:outline-none`}
            >
              Members
            </button>
            <button
              onClick={() => handleTabChange("banned")}
              className={`${
                activeTab === "banned"
                  ? "bg-red-500 text-white"
                  : "bg-gray-200 text-gray-600"
              } py-2 px-4 rounded-md focus:outline-none focus:bg-red-600`}
            >
              Banned Members
            </button>
          </div>
          {activeTab === "members" && (
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
                    {filteredUsers?.map((user: any) => (
                      <div
                        key={user.id}
                        className="bg-[#050A30] shadow-lg rounded-3xl overflow-hidden flex justify-between items-center p-4 mb-4"
                      >
                        <div className="flex flex-row items-center">
                          <div className="relative">
                            <div
                              className={`w-4 h-4 absolute top-2 right-3 rounded-full ${
                                user.status === "ONLINE"
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
                          {renderActions(currentUserRole, user)}
                          {/* "Owner" changed to user.role  */}
                          {/* the "Admin" is the user connected role in this room channel */}
                          {/* it can be "Admin" "Owner" "Member" */}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === "banned" && (
            <div>
              <div>
                {/* Add a scrollable container with a max height */}
                <div className="max-h-500px overflow-y-auto">
                  <div className="mt-4">
                    {selectedChannel?.bannedUsers?.map((user: any) => (
                      <div
                        key={user.id}
                        className="bg-[#050A30] shadow-lg rounded-3xl overflow-hidden flex justify-between items-center p-4 mb-4"
                      >
                        <div className="flex flex-row items-center">
                          <div className="relative">
                            <div
                              className={`w-4 h-4 absolute top-2 right-3 rounded-full ${
                                user.status === "ONLINE"
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
                          {(currentUserRole === "Owner" ||
                            currentUserRole === "Admin") && (
                            <button
                              key={"index"}
                              className={`text-red-600 mr-2`}
                              onClick={() => handleUnBanMember(user)}
                            >
                              Unban
                            </button>
                          )}
                          {/* "Owner" changed to user.role  */}
                          {/* the "Admin" is the user connected role in this room channel */}
                          {/* it can be "Admin" "Owner" "Member" */}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal>
      )}

      {/* popup of add member */}
      {isAddMemberPopupOpen && (
        <Modal
          isOpen={isAddMemberPopupOpen}
          style={customStyles}
          contentLabel="Modal"
        >
          <div className="flex justify-between items-center mb-3 z-10">
            <h2 className="font-bold">Add Members</h2>
            {selectedUsers.length > 0 && (
              <button
                type="button"
                className="focus:outline-none text-white rounded-3xl bg-[#654795]  font-medium  text-sm px-5 py-2.5 "
                onClick={(e) => InviteUsers(e)} // it's an array of selected users to invite them
              >
                Add {selectedUsers.length}
              </button>
            )}
            <AiOutlineClose
              className={"cursor-pointer"}
              onClick={() => {
                // setAvatarPreview(null);
                setIsAddMemberPopupOpen(false);
              }}
            />
          </div>

          <hr className="h-1 mx-auto bg-[#654795] border-0 rounded my-8 dark:bg-gray-700" />
          <input
            type="search"
            placeholder="Search users..."
            value={searchQuery}
            onChange={handleSearchInputChange}
            className="block w-full p-4 pl-10 text-sm text-white mb-2 rounded-3xl bg-[#1F1F1F] focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
          <div className="max-h-500px overflow-y-auto">
            <div className="mt-4">
              {filteredUserList &&
                filteredUserList.map((user: any) => (
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
                          alt={`${user.username}'s avatar`}
                          className="w-16 h-16 object-cover rounded-full mr-4"
                        />
                      </div>
                      <div>
                        <h3 className="text-xl text-white font-semibold">
                          {user.username}
                        </h3>
                      </div>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.username)}
                        onChange={() => handleCheckChange(user.username)}
                        className="accent-[#654795] h-5 w-5"
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default BoxChat;
