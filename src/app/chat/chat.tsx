import { User } from '@/types/user'
import { Room } from '@/types/room'
import { Plus, LogOut, MessageSquare, UserCircle, MoreVertical, X } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import ButtonToggle from '@/components/button-toggle'
import ButtonGhost from '@/components/button-ghost'
import ButtonFilled from '@/components/button-filled'
import Input from '@/components/input'

const fetcher = (url: string) => fetch(url, { method: 'GET' }).then((res: Response) => res.json())

export default function Chat() {
    const { data: user } = useSWR<User>('/api/user', fetcher)
    const [activeRoom, setActiveRoom] = useState<string>('No Room Selected')
    const [roomStatus, setRoomStatus] = useState<string>('Disconnected')
    const [message, setMessage] = useState<string>('')

    async function onCreateRoom(name: string) {
        const response = await fetch('/api/room', {
            method: 'POST',
            body: JSON.stringify({ name: name })
        }).then((res: Response) => res)
        console.log(response)
    }

    useEffect(() => {
        console.log(user)
    }, [user])

    return (
        <div className="flex mx-auto max-w-7xl h-screen px-8 py-24 space-x-4">
            <div className="flex flex-col w-80 h-full space-y-4">
                <div className="flex justify-between items-center p-6 bg-surface dark:bg-surface-dark rounded-lg shadow">
                    <div className="flex items-center">
                        <UserCircle className="m-3" size={24} />
                        <h1 className="text-center font-semibold text-sm">{user?.name}</h1>
                    </div>
                    <ButtonGhost className="justify-end" icon={<LogOut size={24} />} onClick={() => signOut()} />
                </div>
                <div className="flex flex-grow flex-col p-6 bg-surface dark:bg-surface-dark rounded-lg shadow space-y-6">
                    <ButtonFilled icon={<Plus size={20} />} text="Create Room" onClick={() => {}} />
                    <div className="flex flex-col space-y-1 overflow-scroll">
                        {user?.rooms?.map((room: Room) => (
                            <ButtonToggle
                                key={room.id}
                                icon={<MessageSquare size={20} />}
                                text={room.name}
                                toggled={room.id === activeRoom}
                                onClick={() => setActiveRoom(room.id)}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex flex-col justify-between flex-grow h-full bg-surface dark:bg-surface-dark rounded-lg shadow">
                <div className="flex justify-between p-6">
                    <div className="flex flex-col justify-center">
                        <p className="text-sm">{activeRoom}</p>
                        <p className="text-sm">{roomStatus}</p>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <ButtonGhost icon={<X size={24} />} onClick={() => {}} />
                        <ButtonGhost icon={<MoreVertical size={24} />} onClick={() => {}} />
                    </div>
                </div>
                <div className="flex flex-grow flex-col space-y-6 p-6 mx-6 overflow-scroll">
                    <p>MESSAGE</p>
                    <p>MESSAGE</p>
                    <p>MESSAGE</p>
                </div>
                <div className="p-8">
                    <Input
                        id="chat"
                        type="text"
                        placeholder="Message To Chat"
                        className="w-full py-4 px-4"
                        value={message}
                        onChange={(e) => setMessage(e)}
                    />
                </div>
            </div>
        </div>
    )
}
