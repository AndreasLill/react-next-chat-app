import { Message } from '@/types/message'
import { User } from '@/types/user'
import { PusherLogger } from '@/utils/logging'
import Pusher, { Members, Options, PresenceChannel } from 'pusher-js'
import { useEffect, useState } from 'react'
import useSWR, { mutate } from 'swr'
import { ApiMessageAnnounce, ApiMessageSend, ApiRoomAdd, ApiRoomJoin } from '@/types/api'
import { Room } from '@/types/room'
import { channelPrefix } from '@/lib/pusher'

Pusher.log = PusherLogger
const fetcher = (url: string) => fetch(url).then((res: Response) => res.json())

export default function chatViewModel() {
    const { data: user } = useSWR<User>('/api/user/get', fetcher)
    const [currentRoom, setCurrentRoom] = useState<Room | null>(null)
    const [sending, setSending] = useState<boolean>(false)
    const [connecting, setConnecting] = useState<boolean>(false)
    const [messages, setMessages] = useState<Message[]>([])
    const [pusherClient, setPusherClient] = useState<Pusher>()
    const [members, setMembers] = useState<Members | null>(null)

    async function onCreateRoom(name: string) {
        const response = await fetch('/api/room/add', {
            method: 'POST',
            body: JSON.stringify({ name: name } as ApiRoomAdd)
        }).then((res: Response) => res)
        const id = await response.json()

        // Revalidate cache to fetch new data.
        // TODO: Change later to mutate data in cache.
        mutate('/api/user/get').then(() => {
            console.log(`Room ${id} was created.`)
        })
    }

    async function onJoinRoom(id: string) {
        const response = await fetch('/api/room/join', {
            method: 'POST',
            body: JSON.stringify({ id: id } as ApiRoomJoin)
        }).then((res: Response) => res)

        // Revalidate cache to fetch new data.
        // TODO: Change later to mutate data in cache.
        mutate('/api/user/get').then(() => {
            console.log(`Joined room ${id}.`)
            //TODO: onConnectToRoom() on join new room.
        })
    }

    function onConnectToRoom(room: Room) {
        if (currentRoom?.id === room.id) {
            return
        }

        setConnecting(true)
        setCurrentRoom(room)
        const logId = crypto.randomUUID().toUpperCase()
        setMessages([{ id: `log-${logId}`, sent: '', text: `Connecting to ${room.name}...` } as Message])

        if (currentRoom) {
            pusherClient?.unsubscribe(`${channelPrefix}${currentRoom.id}`)
        }

        // TODO: Get room message history before subscribing.

        const channel = pusherClient?.subscribe(`${channelPrefix}${room.id}`) as PresenceChannel
        channel.bind('message', (message: Message) => {
            setMessages((current) => [...current, message])
        })
        channel.bind('pusher:subscription_succeeded', async (members: Members) => {
            const response = await fetch('/api/message/announce', {
                method: 'POST',
                body: JSON.stringify({ type: 'join', channel: channel.name } as ApiMessageAnnounce)
            }).then((res: Response) => res)
            setMembers(members)
            setConnecting(false)
        })
    }

    function onDisconnectFromCurrentRoom() {
        if (!currentRoom) {
            return
        }
        pusherClient?.unsubscribe(`${channelPrefix}${currentRoom.id}`)
        setMembers(null)

        const id = crypto.randomUUID().toUpperCase()
        setMessages([{ id: `log-${id}`, sent: '', text: `Disconnected from ${currentRoom.name}.` } as Message])
        setCurrentRoom(null)
    }

    async function onSendMessage(text: string) {
        setSending(true)
        const response = await fetch('/api/message/send', {
            method: 'POST',
            body: JSON.stringify({ room: currentRoom?.id, text: text } as ApiMessageSend)
        }).then((res: Response) => res)
        setSending(false)
    }

    useEffect(() => {
        setPusherClient(
            new Pusher(
                process.env.NEXT_PUBLIC_PUSHER_KEY as string,
                {
                    activityTimeout: 30000,
                    pongTimeout: 15000,
                    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
                    authEndpoint: '/api/auth/pusher'
                } as Options
            )
        )
        // Unsubscribe, unbind and disconnect on unmount.
        return () => {
            pusherClient?.allChannels().forEach((channel) => {
                pusherClient.unsubscribe(channel.name)
            })
            pusherClient?.disconnect()
        }
    }, [])

    return {
        user,
        currentRoom,
        sending,
        connecting,
        messages,
        members,
        onCreateRoom,
        onJoinRoom,
        onConnectToRoom,
        onDisconnectFromCurrentRoom,
        onSendMessage
    }
}
