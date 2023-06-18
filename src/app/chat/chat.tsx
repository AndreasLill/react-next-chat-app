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

const fetcher = (url: string) => fetch(url, { method: 'GET' }).then((res: Response) => res.json())

export default function Chat() {
    const { data: user } = useSWR<User>('/api/user/get', fetcher)
    const [activeRoom, setActiveRoom] = useState<string>('No Room Selected')
    const [roomStatus, setRoomStatus] = useState<string>('Disconnected')
    const [message, setMessage] = useState<string>('')

    async function onCreateRoom(name: string) {
        const response = await fetch('/api/room/add', {
            method: 'POST',
            body: JSON.stringify({ name: name })
        }).then((res: Response) => res)

        console.log(response)
        // Revalidate cache to fetch new data.
        // TODO: Change later to mutate data in cache.
        mutate('/api/user/get').then(() => {
            console.log('Room was created.')
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
            setActiveRoom(id)
            console.log('Joined the room.')
        })
    }

    useEffect(() => {
        console.log(user)
    }, [user])

    return (
        <div className="flex mx-auto max-w-7xl h-screen px-8 py-24 space-x-4">
            <div className="flex flex-col w-80 h-full space-y-4">
                <div className="flex justify-between items-center p-6 bg-white dark:bg-zinc-900 rounded-lg shadow">
                    <div className="flex items-center">
                        <UserCircle className="m-3" size={24} />
                        <h1 className="text-center font-semibold">{user?.name}</h1>
                    </div>
                    <ButtonIcon className="justify-end" tooltip="Log Out" icon={<LogOut size={24} />} onClick={() => signOut()} />
                </div>
                <div className="flex flex-grow flex-col p-6 bg-white dark:bg-zinc-900 rounded-lg shadow space-y-6 overflow-hidden">
                    <div className="flex space-x-2">
                        <DialogRoomCreate
                            trigger={<ButtonIcon className="w-fit" tooltip="Create Room" icon={<Plus size={24} />} />}
                            onSubmit={(value) => onCreateRoom(value)}
                        />
                        <DialogRoomJoin
                            trigger={<ButtonIcon className="w-fit" tooltip="Join Room" icon={<Link2 size={24} />} />}
                            onSubmit={(value) => onJoinRoom(value)}
                        />
                    </div>
                    <ul className="flex flex-grow flex-col space-y-1 overflow-scroll">
                        {user?.rooms?.map((room: Room) => (
                            <RoomToggle
                                key={room.id}
                                text={room.name}
                                toggled={room.id === activeRoom}
                                onClick={() => setActiveRoom(room.id)}
                            />
                        ))}
                    </ul>
                </div>
            </div>
            <div className="flex flex-col justify-between flex-grow h-full bg-white dark:bg-zinc-900 rounded-lg shadow">
                <div className="flex justify-between p-6">
                    <div className="flex flex-col justify-center">
                        <p className="text-sm">{activeRoom}</p>
                        <p className="text-sm">{roomStatus}</p>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <ButtonIcon tooltip="Options" icon={<MoreVertical size={24} />} onClick={() => {}} />
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
