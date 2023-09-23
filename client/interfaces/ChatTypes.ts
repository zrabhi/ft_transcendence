export interface Message {
    sender?:string
    reciever?:string
    avatar?:string
    content: string
}

export interface chat
{
    id:string
    name:string
    users:string[]
    owner:string
    password:string
    member_limit: string
}
