import {
  AiFillPlusCircle,
  AiOutlineClose,
  AiOutlineMessage,
  AiOutlineSetting,
} from "react-icons/ai";

import UserCard from "../UserCard";
import { BsSearch } from "react-icons/bs";
import {
  baseChatUrl,
  getRequest,
  postRequest,
} from "@/app/context/utils/service";
import { Key, useEffect, useState } from "react";

import Modal from "react-modal";
import { Formik, Form, Field, ErrorMessage } from "formik";

import * as Yup from "yup";
import { showSnackbar } from "@/app/context/utils/showSnackBar";


const Channels = ({selectedChannels,setSelectedChannels,channels, setSelectedChat, setSelectedChannel, setMessages, setChannels, }: any) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleClickUserMessage = async (channel: any) => {
    try{
    const response = await getRequest(
      `${baseChatUrl}/getChannel/${channel?.id}`
    );
    if (response?.error)
    {
        if(response?.message === "Unauthorized")
          showSnackbar("Unauthorized", false)
      return ;
    }
    setSelectedChat(channel);
    setSelectedChannel(response);
  }catch(err)
  {

  }
  };

  useEffect(() => {

    if (channels?.length > 0)
      setSelectedChannels(
        channels?.filter((ch: any) =>
          !isChecked ? ch?.type === "dm" : ch?.type === "room"
        )
      );
  }, [isChecked, channels]);
useEffect(()=>{
  console.log("joined", channels);
},[channels])
  return (
    <div className="users-container pt-20">
      

      <ChannelsSwitcher isChecked={isChecked} setIsChecked={setIsChecked} />
      {isChecked && (
          <AddNewChannel
            setChannels={setChannels}
            setSelectedChannel={setSelectedChannel}
            setSelectedChat={setSelectedChat}
            setMessages={setMessages}
          />
        )}
      <div className='channels-chat'>
        

        {selectedChannels?.length > 0 ?
          (selectedChannels?.map((channel: any, index: Number) => {
            return (
              <UserCard
                channel={channel.channel}
                key={index}
                onClick={() => handleClickUserMessage(channel.channel)} // replacing channel with channel.channel
              />
            );
          })) : <div className="text-white text-lg flex justify-center items-center mt-4"> You have no messages yet! </div>
        }
      </div>
    </div>
  );
};

const ChannelsSwitcher = ({ isChecked, setIsChecked }: any) => {
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <label className="w-full themeSwitcherTwo items-center shadow-card inline-flex cursor-pointer text-white select-none  justify-around rounded-md bg-[#1F0D3C] p-1">
      <input
        type="checkbox"
        className="sr-only"
        checked={isChecked}
        onChange={handleCheckboxChange}
      />
      <span
        className={`flex items-center justify-center w-[50%] space-x-[6px] rounded py-2 text-sm font-medium ${
          !isChecked ? "text-primary bg-[#654795]" : "text-body-color"
        }`}
      >
        Dm's
      </span>
      <span
        className={`flex items-center justify-center w-[50%] space-x-[6px] rounded py-2 text-sm font-medium ${
          isChecked ? "text-primary bg-[#654795]" : "text-body-color"
        }`}
      >
        Rooms
      </span>
    </label>
  );
};

const AddNewChannel = ({ setChannels,setSelectedChannel, setSelectedChat,  setMessages}: any) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="flex justify-center items-center mb-2">
      <button
        className="mt-3 flex justify-center items-center gap-3 block text-white bg-[#654795] focus:outline-none font-medium rounded-3xl text-sm px-5 py-2.5 text-center"
        type="button"
        onClick={handleOpen}
      >
        <AiFillPlusCircle /> New Room
      </button>
      <ModalContainer
        setChannels={setChannels}
        isOpen={isOpen}
        setMessages={setMessages}
        handleOpen={handleOpen}
        setSelectedChannel={setSelectedChannel}
        setSelectedChat={setSelectedChat}
      />
    </div>
  );
};

interface FormValues {
  name: string;
  type: string;
  password: string;
  avatar: File | null | string; // Change the type to File | null for file input
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Room name is required"),
  type: Yup.string().required("Room type is required"),
  password: Yup.string()
    .test(
      "password-required",
      "Password is required when type is PROTECTED",
      function (value) {
        // 'this' refers to the current Yup validation context
        const type = this.parent.type;
        if (type === "PROTECTED") {
          return !!value;
        }
        return true; // Password is not required for other types
      }
    )
    .min(6, "Password must be at least 6 characters"),
  avatar: Yup.mixed()
    .test("fileSize", "File size is too large", (value: any) => {
      if (!value) return true; // No file selected is fine
      return value.size <= 1024 * 1024; // 1 MB
    })
    .test(
      "fileType",
      "Invalid file type. Only image files allowed.",
      (value: any) => {
        if (!value) return true; // No file selected is fine
        return ["image/jpeg", "image/png", "image/gif"].includes(value.type);
      }
    ),
});

const initialValues: FormValues = {
  name: "",
  type: "",
  password: "",
  avatar: "",
};

const ModalContainer = ({
  isOpen,
  handleOpen,
  setChannels,
  setSelectedChannel,
  setSelectedChat,
  setMessages
}: any) => {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null); // State to store the avatar image URL

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
    },
  };
  Modal.setAppElement("div");

  const handleSubmit = async (values: FormValues, { resetForm }: any) => {
    // Handle form submission here
    try{
    console.log("value of format ", values);
    const roomForm = {
      name: values.name,
      type: values.type,
      avatar: values.avatar,
      password: values.password,
      memberLimit: 30,
    };
    const response = await postRequest(
      `${baseChatUrl}/create/room`,
      JSON.stringify(roomForm)
      );
     console.log("channel craeted", response);
    if (response?.error)
    {
      if (response?.message === "Unauthorized")
          showSnackbar("Unauthorized", false)
      return ;
    }
    setMessages([]);
    setSelectedChannel(response);
    setSelectedChat(response.channel);
    setChannels((prev: any) => [response.lastMessage, ...prev]);
    resetForm();
    handleOpen();
  }catch(err)
  {

  }
  };

  return (
    <Modal isOpen={isOpen} style={customStyles} contentLabel="Modal">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-bold">Create a room chat</h2>
        <AiOutlineClose
          className={"cursor-pointer"}
          onClick={() => {
            setAvatarPreview(null);
            handleOpen();
          }}
        />
      </div>
      <hr className="h-1 mx-auto bg-[#654795] border-0 rounded my-8 dark:bg-gray-700" />
      <div>
        <>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ handleSubmit, isSubmitting, setFieldValue, values }) => (
              <Form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-gray-700 font-medium"
                  >
                    Room Name
                  </label>
                  <Field
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Enter room name"
                    className="border border-gray-300 rounded w-full px-3 py-2 my-2"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="type"
                    className="block text-gray-700 font-medium"
                  >
                    Room Type
                  </label>
                  <Field
                    as="select" // Use "as" to render a select dropdown
                    name="type"
                    id="type"
                    className="border border-gray-300 rounded w-full px-3 py-2 my-2"
                  >
                    <option value="">Select type of this room</option>
                    <option value="PUBLIC">PUBLIC</option>
                    <option value="PRIVATE">PRIVATE</option>
                    <option value="PROTECTED">PROTECTED</option>
                  </Field>
                  <ErrorMessage
                    name="type"
                    component="div"
                    className="text-red-500"
                  />
                </div>

                {values.type === "PROTECTED" && (
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-gray-700 font-medium"
                    >
                      Password
                    </label>
                    <Field
                      type="password"
                      name="password"
                      id="password"
                      placeholder="Enter your password"
                      className="border border-gray-300 rounded w-full px-3 py-2 my-2"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                )}
                <div className="w-full flex justify-end">
                  <button
                    type="submit"
                    className="bg-[#654795] text-white rounded px-4 py-2"
                    disabled={isSubmitting}
                  >
                    Submit
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </>
      </div>
    </Modal>
  );
};

export default Channels;
