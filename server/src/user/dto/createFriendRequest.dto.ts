import { State } from "@prisma/client"

export class createFriendRequest{
    requester_id: string
    requested_id: string
    state:State
}