import { Message } from '@/types/message'
import { User } from '@/types/user'
import { PusherLogger } from '@/utils/logging'
import Pusher, { Options } from 'pusher-js'
import { useEffect, useState } from 'react'
import useSWR, { mutate } from 'swr'
import { ApiBodyMessageSend } from '@/types/api'
import { Room } from '@/types/room'

Pusher.log = PusherLogger
const fetcher = (url: string) => fetch(url, { method: 'GET' }).then((res: Response) => res.json())

export default function chatViewModel() {
    const { data: user } = useSWR<User>('/api/user/get', fetcher)
    const [currentRoom, setCurrentRoom] = useState<Room | null>(null)
    const [isSending, setSending] = useState<boolean>(false)
    const [messages, setMessages] = useState<Message[]>([])
    const [pusherClient, setPusherClient] = useState<Pusher>()

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

    async function onConnectToRoom(room: Room) {
        // Reset shown messages.
        setMessages([{ id: 'server0', sent: 'now', room: room.id, user: 'Server', text: `Connected to ${room.id}.` } as Message])
        setCurrentRoom(room)
    }

    async function onSendMessage(room: Room | null, text: string) {
        if (isSending || !room || !text) {
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

    function onReceiveMessage(message: Message, roomId: string, activeRoom: Room | null) {
        // Add received message to message array if the message was sent to current room.
        if (activeRoom?.id === roomId) {
            setMessages((current) => [...current, message])
        }
        // TODO: else add (number) notification to room name.
    }

    useEffect(() => {
        setPusherClient(
            new Pusher(
                process.env.NEXT_PUBLIC_PUSHER_KEY as string,
                {
                    activityTimeout: 30000,
                    pongTimeout: 15000,
                    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER
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
            console.log('unmounted pusher client.')
        }
    }, [])

    useEffect(() => {
        // Subscribe to all rooms when rooms change.
        user?.rooms?.forEach((room) => {
            const channel = pusherClient?.subscribe(room.id)
            channel?.bind('message', (data: any) => onReceiveMessage(data, channel.name, currentRoom))
            console.log(`Subscribed to room ${room.id}`)
        })
        // Clean up old subscriptions and bindings.
        return () => {
            pusherClient?.allChannels().forEach((channel) => {
                channel.unsubscribe()
                channel.unbind('message')
            })
            console.log(`Unmounted room subscriptions.`)
        }
    }, [user?.rooms])

    useEffect(() => {
        // Rebind all channels after changing active room.
        pusherClient?.allChannels().forEach((channel) => {
            channel.bind('message', (data: any) => onReceiveMessage(data, channel.name, currentRoom))
            console.log(`Rebinded room ${channel.name}`)
        })
        // Clean up old bindings.
        return () => {
            pusherClient?.allChannels().forEach((channel) => {
                channel.unbind('message')
            })
            console.log(`Unmounted room bindings.`)
        }
    }, [currentRoom])

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
