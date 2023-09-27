export interface channel
{
    id: string;
    name: string;
    users?:string[]
    owner?:string;
    type:string;
}

export  interface channels{
    id: string;
    type: string;
    username: string;
    avatar: string;
    message: string;
    status: string;
}

export interface blockedUsers
{
    usernam:string
}