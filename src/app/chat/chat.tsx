import { Room } from '@/types/room'
import { LogOut, UserCircle, MoreVertical, Plus, Link2 } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useState } from 'react'
import Input from '@/components/input'
import RoomToggle from './room-toggle'
import DialogRoomCreate from './dialog/dialog-room-create'
import ButtonIcon from '@/components/button-icon'
import DialogRoomJoin from './dialog/dialog-room-join'
import Tooltip from '@/components/tooltip'
import chatViewModel from './chat-viewmodel'

export default function Chat() {
    const { user, currentRoom, messages, onCreateRoom, onJoinRoom, onConnectToRoom } = chatViewModel()
    const [input, setInput] = useState<string>('')
    const [dialogCreateRoom, setDialogCreateRoom] = useState<boolean>(false)
    const [dialogJoinRoom, setDialogJoinRoom] = useState<boolean>(false)

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
                                toggled={room.id === currentRoom}
                                onClick={() => onConnectToRoom(room.id)}
                            />
                        ))}
                    </ul>
                </div>
            </div>
            <div className="flex flex-col flex-1 h-full bg-white dark:bg-zinc-900 rounded-lg shadow overflow-auto">
                <div className="flex items-center justify-between p-6">
                    <p className="text-sm">{currentRoom}</p>
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
