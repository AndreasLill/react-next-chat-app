import { Room } from '@/types/room'
import { LogOut, UserCircle, MoreVertical, Plus, Link2, Send, Loader2, HelpCircle, Users, X } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { MutableRefObject, useRef, useState } from 'react'
import Input from '@/components/input'
import RoomToggle from './room-toggle'
import DialogRoomCreate from './dialog/dialog-room-create'
import ButtonIcon from '@/components/button-icon'
import DialogRoomJoin from './dialog/dialog-room-join'
import Tooltip from '@/ui/overlay/tooltip'
import chatViewModel from './chat-viewmodel'
import ButtonFilled from '@/components/button-filled'
import { formatDate } from '@/utils/time'
import PopoverRoomDetails from './popover/popover-room-details'

export default function Chat() {
    const {
        user,
        currentRoom,
        isSending,
        messages,
        onCreateRoom,
        onJoinRoom,
        onConnectToRoom,
        onDisconnectFromCurrentRoom,
        onSendMessage
    } = chatViewModel()

    const [input, setInput] = useState<string>('')
    const [inputError, setInputError] = useState<string>('')
    const [dialogCreateRoom, setDialogCreateRoom] = useState<boolean>(false)
    const [dialogJoinRoom, setDialogJoinRoom] = useState<boolean>(false)

    return (
        <div className="mx-auto flex h-screen max-w-[96rem] space-x-4 px-8 py-24">
            <div className="flex h-full w-80 flex-col space-y-4">
                <div className="flex items-center justify-between rounded-lg bg-white p-6 shadow dark:bg-zinc-900">
                    <div className="flex items-center">
                        <UserCircle className="m-3" size={24} />
                        <h1 className="text-center font-semibold">{user?.name}</h1>
                    </div>
                    <Tooltip text="Log Out">
                        <ButtonIcon icon={<LogOut size={24} />} onClick={() => signOut()} />
                    </Tooltip>
                </div>
                <div className="flex flex-1 flex-col space-y-6 overflow-hidden rounded-lg bg-white p-6 shadow dark:bg-zinc-900">
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
            <div className="flex h-full flex-1 flex-col overflow-auto rounded-lg bg-white shadow dark:bg-zinc-900">
                <div className="flex justify-between">
                    <div className="flex items-center space-x-2 p-6">
                        <PopoverRoomDetails roomId={currentRoom?.id ?? ''}>
                            <Tooltip text="Show More">
                                <ButtonIcon icon={<HelpCircle size={24} />} onClick={() => {}} />
                            </Tooltip>
                        </PopoverRoomDetails>
                        <ButtonIcon icon={<Users size={24} />} onClick={() => {}} />
                    </div>
                    <div className="flex items-center space-x-2 p-6">
                        <ButtonIcon icon={<X size={24} />} onClick={onDisconnectFromCurrentRoom} />
                    </div>
                </div>
                <div
                    className={`mx-6 flex flex-1 flex-col overflow-y-scroll rounded-lg border border-black/20 dark:border-white/20 ${
                        currentRoom ? 'bg-slate-100 dark:bg-zinc-950' : 'bg-slate-100/50 dark:bg-zinc-950/50'
                    }`}
                >
                    {messages?.map((message) => (
                        <div key={message.id} className="flex flex-col px-6 py-3 hover:bg-slate-200 dark:hover:bg-slate-900">
                            {message.user && (
                                <div>
                                    <span className="text-md font-semibold text-black dark:text-white">{message.user}</span>
                                    <span className="mx-2 text-sm text-black/50 dark:text-white/50">
                                        {formatDate(navigator.language, message.sent)}
                                    </span>
                                </div>
                            )}
                            {message.user ? (
                                <span className="break-all">{message.text}</span>
                            ) : (
                                <span className="break-all text-sm font-semibold text-emerald-500">{message.text}</span>
                            )}
                        </div>
                    ))}
                </div>
                <form
                    className="flex items-center space-x-6 p-6"
                    onSubmit={(e) => {
                        e.preventDefault()
                        if (!input.match('^.{1,255}$')) {
                            setInputError('Please enter a text with 1-255 characters.')
                            return
                        }
                        if (!currentRoom) {
                            return
                        }
                        onSendMessage(currentRoom, input)
                        setInput('')
                    }}
                >
                    <div className="flex-grow">
                        <Input
                            id="chat"
                            type="text"
                            error={inputError}
                            setError={setInputError}
                            placeholder="Message To Chat"
                            autocomplete="off"
                            disabled={!currentRoom}
                            className="w-full px-4 py-4 disabled:cursor-not-allowed"
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
