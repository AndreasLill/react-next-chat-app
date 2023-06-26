import { Room } from '@/types/room'
import { LogOut, Plus, Link2, Send, HelpCircle, Users, X } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useState } from 'react'
import RoomToggle from './room-toggle'
import DialogRoomCreate from './dialog/dialog-room-create'
import DialogRoomJoin from './dialog/dialog-room-join'
import Tooltip from '@/ui/overlay/tooltip'
import chatViewModel from './chat-viewmodel'
import { formatDate } from '@/utils/time'
import PopoverRoomDetails from './popover/popover-room-details'
import clsx from 'clsx'
import Button from '@/ui/button/button'
import InputText from '@/ui/input/input-text'

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
                <div className="flex items-center justify-between rounded-lg bg-surface p-6 shadow dark:bg-surface-dark">
                    <h1 className="text-center font-semibold">{user?.name}</h1>
                    <Tooltip text="Log Out">
                        <Button
                            variant="subtle"
                            icon={<LogOut size={20} />}
                            className="text-on-surface hover:bg-on-surface/10 dark:text-on-surface-dark dark:hover:bg-on-surface-dark/10"
                            onClick={signOut}
                        />
                    </Tooltip>
                </div>
                <div className="flex flex-1 flex-col space-y-6 overflow-hidden rounded-lg bg-surface p-6 shadow dark:bg-surface-dark">
                    <div className="flex space-x-2">
                        <Tooltip text="Create Room">
                            <Button
                                variant="subtle"
                                icon={<Plus size={20} />}
                                className="text-on-surface hover:bg-on-surface/10 dark:text-on-surface-dark dark:hover:bg-on-surface-dark/10"
                                onClick={() => setDialogCreateRoom(true)}
                            />
                        </Tooltip>
                        <DialogRoomCreate
                            state={dialogCreateRoom}
                            setState={setDialogCreateRoom}
                            onSubmit={(value) => onCreateRoom(value)}
                        />
                        <Tooltip text="Join Room">
                            <Button
                                variant="subtle"
                                icon={<Link2 size={20} />}
                                className="text-on-surface hover:bg-on-surface/10 dark:text-on-surface-dark dark:hover:bg-on-surface-dark/10"
                                onClick={() => setDialogJoinRoom(true)}
                            />
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
            <div className="flex h-full flex-1 flex-col overflow-auto rounded-lg bg-surface shadow dark:bg-surface-dark">
                <div className="flex justify-between">
                    <div className="flex items-center space-x-2 p-6">
                        <PopoverRoomDetails roomId={currentRoom?.id ?? ''}>
                            <Tooltip text="Show More">
                                <Button
                                    variant="subtle"
                                    icon={<HelpCircle size={20} />}
                                    className="text-on-surface hover:bg-on-surface/10 dark:text-on-surface-dark dark:hover:bg-on-surface-dark/10"
                                    onClick={() => {}}
                                />
                            </Tooltip>
                        </PopoverRoomDetails>
                        <Button
                            variant="subtle"
                            icon={<Users size={20} />}
                            className="text-on-surface hover:bg-on-surface/10 dark:text-on-surface-dark dark:hover:bg-on-surface-dark/10"
                            onClick={() => {}}
                        />
                    </div>
                    <div className="flex items-center space-x-2 p-6">
                        <Button
                            variant="subtle"
                            icon={<X size={20} />}
                            className="text-on-surface hover:bg-on-surface/10 dark:text-on-surface-dark dark:hover:bg-on-surface-dark/10"
                            onClick={onDisconnectFromCurrentRoom}
                        />
                    </div>
                </div>
                <div
                    className={clsx(
                        'mx-6 flex flex-1 flex-col overflow-y-scroll rounded-lg border border-on-surface/20 dark:border-on-surface-dark/20',
                        currentRoom ? 'bg-background dark:bg-background-dark' : 'bg-background/60 dark:bg-background-dark/60'
                    )}
                >
                    {messages?.map((message) => (
                        <div key={message.id} className="flex flex-col px-6 py-3 hover:bg-primary/10">
                            {message.user && (
                                <div>
                                    <span className="text-md font-semibold">{message.user}</span>
                                    <span className="mx-2 text-sm text-on-surface/50 dark:text-on-surface-dark/50">
                                        {formatDate(navigator.language, message.sent)}
                                    </span>
                                </div>
                            )}
                            {message.user ? (
                                <span className="break-all">{message.text}</span>
                            ) : (
                                <span className="break-all text-sm font-semibold">{message.text}</span>
                            )}
                        </div>
                    ))}
                </div>
                <form
                    className="flex space-x-6 p-6"
                    onSubmit={(e) => {
                        e.preventDefault()
                        if (!input.match('^.{1,255}$')) {
                            setInputError('Please enter a text with 1-255 characters.')
                            return
                        }
                        if (!currentRoom) {
                            return
                        }
                        console.log(input)
                        onSendMessage(currentRoom, input)
                        setInputError('')
                        setInput('')
                    }}
                >
                    <div className="flex-grow">
                        <InputText
                            id="chat"
                            placeholder="Chat Message"
                            autoComplete="off"
                            disabled={!currentRoom}
                            className="py-3 text-sm disabled:cursor-not-allowed"
                            error={inputError}
                            value={input}
                            onChange={(value) => setInput(value)}
                        />
                    </div>
                    <Button
                        variant="filled"
                        type="submit"
                        icon={<Send size={18} />}
                        text="Send"
                        className="h-fit py-3"
                        loading={isSending}
                        disabled={!currentRoom}
                    />
                </form>
            </div>
        </div>
    )
}
