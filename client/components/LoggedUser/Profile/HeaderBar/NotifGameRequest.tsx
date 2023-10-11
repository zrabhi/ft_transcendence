import { AuthContext } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import React, { useContext } from "react";

export default function NotifGameRequest({ data }: any) {
  const { notifSocket } = useContext(AuthContext);
  const handleAcceptGame = () => {
    notifSocket.emit("gameAccepted", { username: data.username });
  };
  const handleRefuseGame = () => {};
  return (
    <div className="flex flex-col gap-2" onClick={handleAcceptGame}>
      <span className="text-sm font-semibold">{data.username}</span>
      <span className="text-sm font-semibold">
        You have a game request from
      </span>
    </div>
  );
}
