import { IsNumber } from "class-validator"

export class CreateMatchDto{
    winner_id:string
    loser_id:string
    
    @IsNumber()
    winner_score:number

    @IsNumber()
    loser_score:number
}