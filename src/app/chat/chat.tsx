import { User } from '@/types/user'
import { Room } from '@/types/room'
import { LogOut, UserCircle, MoreVertical, Plus, Link2 } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { mutate } from 'swr'
import Input from '@/components/input'
import RoomToggle from './room-toggle'
import DialogRoomCreate from './dialog/dialog-room-create'
import ButtonIcon from '@/components/button-icon'
import DialogRoomJoin from './dialog/dialog-room-join'
import Tooltip from '@/components/tooltip'
import { Message } from '@/types/message'
import Pusher, { Options } from 'pusher-js'
import { PusherLogger } from '@/utils/logging'

Pusher.log = PusherLogger

const fetcher = (url: string) => fetch(url, { method: 'GET' }).then((res: Response) => res.json())

export default function Chat() {
    const { data: user } = useSWR<User>('/api/user/get', fetcher)
    const [activeRoom, setActiveRoom] = useState<string>('')
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState<string>('')
    const [dialogCreateRoom, setDialogCreateRoom] = useState<boolean>(false)
    const [dialogJoinRoom, setDialogJoinRoom] = useState<boolean>(false)
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
        setActiveRoom(roomId)
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
            channel?.bind('message', (data: any) => onReceiveMessage(data, channel.name, activeRoom))
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
            channel.bind('message', (data: any) => onReceiveMessage(data, channel.name, activeRoom))
            console.log(`Rebinded room ${channel.name}`)
        })
        // Clean up old bindings.
        return () => {
            pusherClient?.allChannels().forEach((channel) => {
                channel.unbind('message')
            })
            console.log(`Unmounted room bindings.`)
        }
    }, [activeRoom])

    return (
        <div className="flex mx-auto max-w-[96rem] h-screen px-8 py-24 space-x-4">
            <div className="flex flex-col w-80 h-full space-y-4">
                <div className="flex justify-between items-center p-6 bg-white dark:bg-zinc-900 rounded-lg shadow">
                    <div className="flex items-center">
                        <UserCircle className="m-3" size={24} />
                        <h1 className="text-center font-semibold">{user?.name}</h1>
                    </div>
                    <Tooltip text="Log Out">
                        <ButtonIcon icon={<LogOut size={24} />} onClick={() => signOut()} />
                    </Tooltip>
                </div>
                <div className="flex flex-1 flex-col p-6 bg-white dark:bg-zinc-900 rounded-lg shadow space-y-6 overflow-hidden">
                    <div className="flex space-x-2">
                        <Tooltip text="Create Room">
                            <ButtonIcon icon={<Plus size={24} />} onClick={() => setDialogCreateRoom(true)} />
                        </Tooltip>
                        <DialogRoomCreate
                            state={dialogCreateRoom}
                            setState={setDialogCreateRoom}
                            onSubmit={(value) => onCreateRoom(value)}
                        />
                        <Tooltip text="Join Room">
                            <ButtonIcon icon={<Link2 size={24} />} onClick={() => setDialogJoinRoom(true)} />
                        </Tooltip>
                        <DialogRoomJoin state={dialogJoinRoom} setState={setDialogJoinRoom} onSubmit={(value) => onJoinRoom(value)} />
                    </div>
                    <ul className="flex flex-grow flex-col space-y-2 overflow-scroll">
                        {user?.rooms?.map((room: Room) => (
                            <RoomToggle
                                key={room.id}
                                text={room.name}
                                toggled={room.id === activeRoom}
                                onClick={() => onConnectToRoom(room.id)}
                            />
                        ))}
                    </ul>
                </div>
            </div>
            <div className="flex flex-col flex-1 h-full bg-white dark:bg-zinc-900 rounded-lg shadow overflow-auto">
                <div className="flex items-center justify-between p-6">
                    <p className="text-sm">{activeRoom}</p>
                    <div className="flex">
                        <Tooltip text="Options">
                            <ButtonIcon icon={<MoreVertical />} onClick={() => {}} />
                        </Tooltip>
                    </div>
                </div>
                <div className="flex flex-1 flex-col mx-6 bg-slate-100 dark:bg-zinc-950 border rounded-lg border-black/20 dark:border-white/20 overflow-y-scroll">
                    {messages?.map((message) => (
                        <p className="pt-6 px-6 break-all" key={message.id}>
                            {`${message.user}: ${message.text}`}
                        </p>
                    ))}
                </div>
                <div className="p-6">
                    <Input
                        id="chat"
                        type="text"
                        placeholder="Message To Chat"
                        className="w-full py-4 px-4"
                        value={input}
                        onChange={(e) => setInput(e)}
                    />
                </div>
            </div>
        </div>
    )
}
