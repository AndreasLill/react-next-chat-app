import { Message } from '@/types/message'
import { User } from '@/types/user'
import { PusherLogger } from '@/utils/logging'
import Pusher, { Members, Options, PresenceChannel } from 'pusher-js'
import { useEffect, useState } from 'react'
import useSWR, { mutate } from 'swr'
import { ApiMessageAnnounce, ApiMessageSend } from '@/types/api'
import { Room } from '@/types/room'
import { channelPrefix } from '@/lib/pusher'

Pusher.log = PusherLogger
const fetcher = (url: string) => fetch(url, { method: 'GET' }).then((res: Response) => res.json())

export default function chatViewModel() {
    const { data: user } = useSWR<User>('/api/user/get', fetcher)
    const [currentRoom, setCurrentRoom] = useState<Room | null>(null)
    const [isSending, setSending] = useState<boolean>(false)
    const [messages, setMessages] = useState<Message[]>([])
    const [pusherClient, setPusherClient] = useState<Pusher>()
    const [members, setMembers] = useState<Members | null>()

    async function onCreateRoom(name: string) {
        const response = await fetch('/api/room/add', {
            method: 'POST',
            body: JSON.stringify({ name: name })
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
            body: JSON.stringify({ id: id })
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

        if (currentRoom) {
            pusherClient?.unsubscribe(`${channelPrefix}${room.id}`)
            pusherClient?.unbind('message')
            pusherClient?.unbind('pusher:subscription_succeeded')
        }

        // TODO: Get room message history before connecting.
        setMessages([])
        setCurrentRoom(room)

        const channel = pusherClient?.subscribe(`${channelPrefix}${room.id}`) as PresenceChannel
        channel.bind('message', onReceiveMessage)
        channel.bind('pusher:subscription_succeeded', async (members: Members) => {
            const response = await fetch('/api/message/announce', {
                method: 'POST',
                body: JSON.stringify({ type: 'join', channel: channel.name } as ApiMessageAnnounce)
            }).then((res: Response) => res)
            setMembers(members)
            console.log('subscription succeed called')
        })
    }

    function onDisconnectFromCurrentRoom() {
        if (!currentRoom) {
            return
        }
        pusherClient?.unsubscribe(`${channelPrefix}${currentRoom.id}`)
        pusherClient?.unbind('message')
        setMembers(null)

        const id = crypto.randomUUID().toUpperCase()
        setMessages([{ id: `log-${id}`, sent: '', room: currentRoom.id, text: `Disconnected from ${currentRoom.name}.` } as Message])
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

    function onReceiveMessage(message: Message) {
        setMessages((current) => [...current, message])
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
                channel.unsubscribe()
                channel.unbind('message')
            })
            pusherClient?.disconnect()
        }
    }, [])

    return {
        user,
        currentRoom,
        isSending,
        messages,
        members,
        onCreateRoom,
        onJoinRoom,
        onConnectToRoom,
        onDisconnectFromCurrentRoom,
        onSendMessage
    }
}
