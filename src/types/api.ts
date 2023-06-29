export interface ApiMessageSend {
    room: string
    text: string
}

export interface ApiMessageAnnounce {
    type: 'join'
    channel: string
}
