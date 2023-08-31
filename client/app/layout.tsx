"use client";
import "./globals.scss";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Footer from "@/components/MainPage/Footer/Footer";
import { useCookies } from "react-cookie";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

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

export default function RootLayout(props: any) {
  const Urls = {
    home: "",
    gameHistory: "game-history",
    instructions: "instructions",
    aboutUs: "about-us",
    login: "login",
  };
  const [cookie, setCookie] = useCookies(["access_token"]);
  const router = useRouter();

  return (
    <html lang="en">
      <body className={roboto.className} suppressHydrationWarning={true}>
        {props.children}
        <Footer />
      </body>
    </html>
  );
}
