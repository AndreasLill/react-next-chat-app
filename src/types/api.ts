export interface ApiMessageSend {
    room: string
    text: string
}

export interface ApiMessageAnnounce {
    type: 'join'
    channel: string
}

export interface ApiUserAdd {
    name: string
    email: string
    password: string
}

export interface ApiRoomAdd {
    name: string
}

export interface ApiRoomJoin {
    id: string
}
