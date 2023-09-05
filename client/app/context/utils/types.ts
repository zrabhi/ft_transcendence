export interface User {
  id: string;
  email: string;
  username: string;
  password: string;
  avatar: string;
  cover: string;
  status: string;
  country: string;
  win: number;
  loss: number;
  ladder_level: number;
  xp: number;
  totalGames: number;
  discordHandler: string;
  twitterHandler: string;
  created_date: string;
  tfa: boolean;
  twoFactorAuthenticationSecret: string;
}

export const userInit = {
  id: "",
  email: "",
  username: "",
  password: "",
  avatar: "",
  cover: "",
  status: "",
  country: "",
  win: 0,
  loss: 0,
  ladder_level: 0,
  xp: 0,
  totalGames: 0,
  discordHandler: "",
  twitterHandler: "",
  created_date: "",
  tfa: false,
  twoFactorAuthenticationSecret: "",
}

export interface LoginError {
  error: boolean;
  message: string;
}

export const LoginErrorInit : LoginError = {
  error: false,
  message:"",
}