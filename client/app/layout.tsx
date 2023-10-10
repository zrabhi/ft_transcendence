"use client";
import "./globals.scss";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Footer from "@/components/MainPage/Footer/Footer";
import { useCookies } from "react-cookie";
import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import { CookiesProvider } from 'react-cookie';
import { InvitationSocketContext } from "./context/notifContext";


const metadata: Metadata = {
  title: "Pong Game",
  description: "This is the awesome pong game you can play on it",
};

const roboto = Montserrat({
  weight: ["200", "300", "400", "500", "600", "700", "900"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  /// we will chenge it later we i found out best solution
  // chekc id there is access_toke if so rederect the  user to profile
  const notifSocket = useContext(InvitationSocketContext);
  const {setNotif, setGameRequest} = useContext(AuthContext);
  const [cookie, setCookie, remove] = useCookies(['access_token']);
  const router = useRouter();

  return (
    <html lang="en">
      <body className={roboto.className} suppressHydrationWarning={true}>
        <AuthProvider>
          {children}
        </AuthProvider>
        {/* <Footer /> */}
      </body>
    </html>
  );
}
