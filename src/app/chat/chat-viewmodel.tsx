import { Message } from '@/types/message'
import { User } from '@/types/user'
import { PusherLogger } from '@/utils/logging'
import Pusher, { Members, Options, PresenceChannel } from 'pusher-js'
import { useEffect, useState } from 'react'
import useSWR, { mutate } from 'swr'
import { ApiBodyMessageSend } from '@/types/api'
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
    const [members, setMembers] = useState<Members>()

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
        // TODO: Get room message history before connecting.
        if (currentRoom?.id === room.id) {
            return
        }

        // Reset all shown messages and add server connected message.
        const id = crypto.randomUUID().toUpperCase()
        setMessages([{ id: `log-${id}`, sent: '', room: room.id, text: `Connected to ${room.name}.` } as Message])
        setCurrentRoom(room)

        // Get currently subscribed members.
        const channel = pusherClient?.channel(`${channelPrefix}${room.id}`) as PresenceChannel
        setMembers(channel.members)
    }

    async function onSendMessage(room: Room, text: string) {
        if (isSending) {
            return
        }

        // TODO: Validate text.
        setSending(true)
        const response = await fetch('/api/message/send', {
            method: 'POST',
            body: JSON.stringify({ room: room.id, text: text } as ApiBodyMessageSend)
        }).then((res: Response) => res)
        setSending(false)
    }

    function onReceiveMessage(message: Message, roomId: string) {
        // Using currentRoom state, so channel has to rebind this function when currentRoom changes.
        if (currentRoom?.id === roomId.replace(channelPrefix, '')) {
            setMessages((current) => [...current, message])
        }
    }

    useEffect(() => {
        // TODO: Batch auth requests if possible to prevent a lot of calls for many rooms.
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

    useEffect(() => {
        // Subscribe to new rooms when a room change.
        user?.rooms?.forEach((room) => {
            var channel = pusherClient?.channel(`${channelPrefix}${room.id}`)
            if (!channel) {
                channel = pusherClient?.subscribe(`${channelPrefix}${room.id}`)
            }
            if (channel) {
                channel?.bind('message', (message: Message) => onReceiveMessage(message, channel!.name))
            }
        })
        // Clean up old bindings.
        return () => {
            pusherClient?.allChannels().forEach((channel) => {
                channel.unbind('message')
            })
        }
    }, [user?.rooms, currentRoom])

    return {
        user,
        currentRoom,
        isSending,
        messages,
        onCreateRoom,
        onJoinRoom,
        onConnectToRoom,
        onSendMessage
    }
}
