import { Room } from './room'

export type User = {
    id: string
    email: string
    name: string
    rooms: Room[]
}
