import { Message } from '@/types/message'
import { User } from '@/types/user'
import { PusherLogger } from '@/utils/logging'
import Pusher, { Options } from 'pusher-js'
import { useEffect, useState } from 'react'
import useSWR, { mutate } from 'swr'

Pusher.log = PusherLogger
const fetcher = (url: string) => fetch(url, { method: 'GET' }).then((res: Response) => res.json())

export default function chatViewModel() {
    const { data: user } = useSWR<User>('/api/user/get', fetcher)
    const [currentRoom, setCurrentRoom] = useState<string>('')
    const [messages, setMessages] = useState<Message[]>([])
    const [pusherClient, setPusherClient] = useState<Pusher>()

    async function onCreateRoom(name: string) {
        const response = await fetch('/api/room/add', {
            method: 'POST',
            body: JSON.stringify({ name: name })
        }).then((res: Response) => res)
        const id = await response.json()
        console.log(response)
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

        console.log(response)
        // Revalidate cache to fetch new data.
        // TODO: Change later to mutate data in cache.
        mutate('/api/user/get').then(() => {
            console.log(`Joined room ${id}.`)
            onConnectToRoom(id)
        })
    }

    async function onConnectToRoom(roomId: string) {
        // Reset shown messages.
        setMessages([])
        setCurrentRoom(roomId)
    }

    function onReceiveMessage(message: any, roomId: string, activeId: string) {
        console.log(`Message: ${message}`)
        if (activeId === roomId) {
            setMessages((current) => [
                ...current,
                { id: Math.random().toString(), room: roomId, user: user?.id, sent: 'time', text: message } as Message
            ])
        }
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
        messages,
        onCreateRoom,
        onJoinRoom,
        onConnectToRoom
    }
}
