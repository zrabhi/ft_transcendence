import {
  baseChatUrl,
  baseUrlUsers,
  getRequest,
  getRequestBody,
  postRequest,
  putRequest,
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
import { showSnackbar } from "@/app/context/utils/showSnackBar";
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
  const ref = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // state for dropdown
  const [isPopupOpen, setIsPopupOpen] = useState(false); // state for members popup

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

  const [chat, setChat] = useState({}); // id && tyoe && avatar && username && message
  const [cookie] = useCookies(["access_token"]);
  const { user, blockedUsers, setBlockedUsers } = useContext(AuthContext);

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

  const roleOptions: any = selectedChannel
    ? getRoleOptions(selectedChannel?.channel?.type)
    : {};

  async function handleBlock(username: string) {
    // username is the selected user to be blocked
    const response = await putRequest(`${baseUrlUsers}/block/${username}`, "");
    if (!response.success) {
      // error has been  occured here
      // in response.error you will find the error occured
    }
    // else
    // if response.success === true , the will be success message in response.message
    // show unblock button
    alert("Block action");
  }

  // added by zac
  async function handleUnBlock(username: string) {
    // username of the the person to be unblocked
    const response = await putRequest(
      `${baseUrlUsers}/unblock/${username}`,
      ""
    );
    if (!response.success) {
      // error has been  occured here
      // in response.error you will find the error occured
    }
    // else
    // if response.success === true , the will be success message in response.message
    // show block button
  }

  function handleShowProfile() {
    alert("Show profile action");
  }

  // change it to async
  const actionOptions: any = {
    Owner: [
      { text: "Ban", action: handleBanMember }, // change to handle Ban and username of the banned one must be provided
      { text: "Mute", action: handleMuteMember }, // change to handle Mute
      { text: "Set as admin", action: handleShowMembers }, // change to handle set As ADMIN
    ],
    Admin: [
      { text: "Ban", action: handleBanMember }, // change to handle Ban
      { text: "Mute", action: handleMuteMember }, // change to handle Mute
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
            option.text === "Block"
        )
      : [];

  const nonSeparateOptions =
    optionsToShow?.length > 0
      ? optionsToShow?.filter(
          (option: any) =>
            option.text !== "Delete Room" &&
            option.text !== "Leave Room" &&
            option.text !== "Block"
        )
      : [];

  // Action functions
  async function handleDeleteRoom() {
    // handle delete room action
    const body = {
      channelId: selectedChannel.channel.id,
      token: cookie.access_token,
    };
    socket.emit("deleteChannel", body);
    // delete the channel for the current user (this action must be done on root page )
    alert("Delete Room action");
  }

  function handleAddMember() {
    // i need the user name of the added person
    // handle add member action
    setIsAddMemberPopupOpen(true);
  }

  function handleShowMembers() {
    setIsPopupOpen(true);
  }

  async function handleLeaveRoom() {
    // socket.emit("leaveRoom", );
    const response = await putRequest(
      `${baseChatUrl}/leaveChannel/${selectedChannel.channel.id}`,
      ""
    );
    if (!response.success) {
      return ;
      // error has been  occured here
      // in response.error you will find the error occured
    }
    socket.emit("LeaveChannel", {
      channelId: selectedChannel.channel.id,
      token: cookie.access_token,
      name: user.username,
    });
    let updatedChannels = channels.filter((channel : any)=> {
      return channel?.channel?.id != selectedChannel.channel.id
    })
    setSelectedChannel(null);
    setChannels(updatedChannels)
    showSnackbar("You left the channel successfully",true);
  }

  function handleBanMember(user: any) {
    // console.log("user clocked ", user);
    alert(` Ban member from room`);
  }

  function handleMuteMember() {
    // / i need the user name of the MUTED person
    alert("Mute member!!");
  }
  async function handleSetAsAdmin(username: string) {
    // i will change this implenetation to sockets
    const response = await putRequest(
      `${baseChatUrl}/setadmin/${selectedChannel.channel.id}/${username}`,
      ""
    );
    if (!response.success) {
      // error has been  occured here
      // in response.error you will find the error occured
    }

    alert("Set the member As Admin ");
  }
  // Function to handle option click
  function handleOptionClick(action: () => void) {
    action(); // Call the corresponding action function
    setIsDropdownOpen(false); // Close the dropdown after clicking an option
  }

  const getCurrentUserRole = () => {
    const currentUser = selectedChannel?.members?.find((member: any) => {
      return member.name === user.username;
    });
    // console.log("currentUser", currentUser);
    setCurrentUserRole(currentUser?.role);
  };
  // trying to create socket to connect with other user here
  useEffect(() => {
    // console.log("selected channe sis =>", selectedChannel);
    getCurrentUserRole();
    setSelectedUsers([]);
    console.log("selected channe sis", selectedChannel);

    (async () => {
      const response = await getRequest(
        `${baseChatUrl}/getMessages/${selectedChannel?.channel?.id}`
      );
      // NOTICE: THE USERS IN CHANNELS ARE STORED IN response.members // (going to remove it cause were not working with this object)
      setMessages(() => []);
      setMessages((prevMessages: any) => [
        ...prevMessages,
        ...response.allMessages,
      ]); //reminderr
      // console.log("chat ", selectedChat);
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
        // blockedUsers.filter((user: any) => {
        //   if (user.username === messageInfo.reciever)
        //     sendedMessage.blocked = true; // added by zac to checked if the user id blocked bu the currUser
        // });
        if (user.username != messageInfo.reciever) {
          sendedMessage.sender = messageInfo.reciever;
          sendedMessage.avatar = messageInfo.avatar;
        } else sendedMessage = messageInfo;
        setMessages((prevMessages: any) => [...prevMessages, sendedMessage]);
        return;
      });
      socket.on("disconnect", () => {
        socket.off("message");
      });
    });
    return () => {
      // socket.off("message");
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

  const sendMessage = async (e: any) => {
    e.preventDefault(); // prevent from refreshing the chat box component
    var time = new Date();
    const body = {
      message: message,
      channelId: selectedChannel.channel.id,
      token: cookie.access_token,
      time: time.getHours() + ":" + time.getMinutes(),
    };
    socket.emit("message", body);
    setMessage("");
  };

  const handleChange = (e: any) => {
    e.preventDefault();
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
                  : "orange"
              }-600 mr-2`}
              onClick={() => option.action(user)}
            >
              {(role === "Owner" &&
                user.role === "Admin" &&
                (option.text === "Ban" || option.text === "Mute")) ||
              (user.role === "Member" &&
                (option.text === "Ban" ||
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
    users.filter((user: any) => {
      // Check if the user's id is in the members array
      return !selectedChannel.members.some(
        (member: any) => member.name === user.username
      );
    })
  );

  // this state is for the search bar to filter easily
  const [filteredUserList, setFilteredUserList] = useState(usersList);

  // function to fo filter onChange
  const handleSearchInputChange = (e: any) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter users based on the search query
    const filtered = usersList.filter((user: any) =>
      user.username.toLowerCase().includes(query)
    );

    setFilteredUserList(filtered);
  };

  const InviteUsers = (e: any) => {
    e.preventDefault();
    if (selectedUsers.length === 0) return;
    const data = {
      channelId: selectedChannel.channel.id,
      username: selectedUsers[0],
      token: cookie.access_token,
    };
    socket.emit("addMember", data);
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
              {nonSeparateOptions.map((option: any, index: Key) => (
                <div
                  key={"unseparated"+index}
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
              {separateOptions.map((option: any, index: Key) => (
                <div
                  key={"separated"+index} //changed previous value "index&"
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
                    key={index}
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
                    key={index}
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
                        {!message.blocked
                          ? message.content
                          : "You can't see message from blocked user!"}
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
                Invite {selectedUsers.length}
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
