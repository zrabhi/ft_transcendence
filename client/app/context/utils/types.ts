export interface User {
    id: string,
    email: string,
    username: string,
    password: string,
    avatar: string,
    cover: string,
    status: string,
    country: string,
    win: number,
    loss: number,
    ladder_level: number,
    xp: number,
    totalGames: number,
    discordHandler: string,
    twitterHandler: string,
    created_date: string,
    tfa:boolean,
    twoFactorAuthenticationSecret: string,
   }

export interface LoginError {
    error: boolean;
    message: string;
  }