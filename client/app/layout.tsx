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

export default function RootLayout(props) {
  const Urls = {
    home: "",
    gameHistory: "game-history",
    instructions: "instructions",
    aboutUs: "about-us",
    login: "login",
  };
  const [cookie, setCookie] = useCookies(["access_token"]);
  const router = useRouter();
  useEffect(() => {
    if (cookie.access_token === "") {
     
      const pathname = window.location.href.split("/");
      if (
        pathname[3] != Urls.home ||
        pathname[3] != Urls.gameHistory ||
        pathname[3] != Urls.instructions ||
        pathname[3] != Urls.aboutUs ||
        pathname[3] != Urls.login
      )
        return router.push("/login");
    }

    // if (cookie.access_token === '')
  });
  return (
    <html lang="en">
      <body className={roboto.className} suppressHydrationWarning={true}>
        {props.children}
        <Footer />
      </body>
    </html>
  );
}
