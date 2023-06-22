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
import { formatDate } from '@/utils/time'

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
                    className={`flex flex-1 flex-col mx-6 bg-slate-100 dark:bg-zinc-950 border rounded-lg border-black/20 dark:border-white/20 overflow-y-scroll ${
                        !currentRoom && 'cursor-not-allowed'
                    }`}
                >
                    {messages?.map((message) => (
                        <div key={message.id} className="flex flex-col px-6 py-3 hover:bg-slate-200 dark:hover:bg-slate-900">
                            {message.user && (
                                <div>
                                    <span className="text-md font-semibold text-black dark:text-white">{message.user}</span>
                                    <span className="text-sm mx-2 text-black/50 dark:text-white/50">
                                        {formatDate(navigator.language, message.sent)}
                                    </span>
                                </div>
                            )}
                            {message.user ? (
                                <span className="break-all">{message.text}</span>
                            ) : (
                                <span className="break-all text-emerald-500 text-sm font-semibold">{message.text}</span>
                            )}
                        </div>
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
                            autocomplete="off"
                            disabled={!currentRoom}
                            className="w-full py-4 px-4"
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
