import { Room } from '@/types/room'
import { LogOut, UserCircle, MoreVertical, Plus, Link2, Send, Loader2 } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useState } from 'react'
import Input from '@/components/input'
import RoomToggle from './room-toggle'
import DialogRoomCreate from './dialog/dialog-room-create'
import ButtonIcon from '@/components/button-icon'
import DialogRoomJoin from './dialog/dialog-room-join'
import Tooltip from '@/components/tooltip'
import chatViewModel from './chat-viewmodel'
import ButtonFilled from '@/components/button-filled'

export default function Chat() {
    const { user, currentRoom, isSending, messages, onCreateRoom, onJoinRoom, onConnectToRoom, onSendMessage } = chatViewModel()
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
                                toggled={room.id === currentRoom?.id}
                                onClick={() => onConnectToRoom(room)}
                            />
                        ))}
                    </ul>
                </div>
            </div>
            <div className="flex flex-col flex-1 h-full bg-white dark:bg-zinc-900 rounded-lg shadow overflow-auto">
                <div className="flex items-center justify-end p-6">
                    <Tooltip text="Options">
                        <ButtonIcon icon={<MoreVertical />} onClick={() => {}} />
                    </Tooltip>
                </div>
                <div
                    className={`flex flex-1 flex-col mx-6 p-6 space-y-4 bg-slate-100 dark:bg-zinc-950 border rounded-lg border-black/20 dark:border-white/20 overflow-y-scroll ${
                        !currentRoom && 'cursor-not-allowed'
                    }`}
                >
                    {messages?.map((message) => (
                        <span key={message.id} className="break-all">{`${message.user}: ${message.text}`}</span>
                    ))}
                </div>
                <form
                    className="flex items-center space-x-6 p-6"
                    onSubmit={(e) => {
                        e.preventDefault()
                        onSendMessage(currentRoom, input)
                        setInput('')
                    }}
                >
                    <div className="flex-grow">
                        <Input
                            id="chat"
                            type="text"
                            placeholder="Message To Chat"
                            className="w-full py-4 px-4"
                            disabled={!currentRoom}
                            value={input}
                            onChange={(e) => setInput(e)}
                        />
                    </div>
                    <ButtonFilled
                        type="submit"
                        text="Send"
                        icon={isSending ? <Loader2 size={24} /> : <Send size={24} />}
                        disabled={isSending || !currentRoom}
                    />
                </form>
            </div>
        </div>
    )
}
