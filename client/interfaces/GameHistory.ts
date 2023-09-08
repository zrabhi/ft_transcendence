import { User } from "@/app/context/utils/types";

export interface GameHistory 
{
    loser: User
    winner: User,
    loserScore: number,
    winnerScore: number,
} 