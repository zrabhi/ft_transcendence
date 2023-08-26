import { isEmail, isNotEmpty, isString } from "class-validator";

export class AuthDto 
{
    email: string;

    password: string;
}