import { Room } from '@/types/room'
import { LogOut, Plus, Link2, HelpCircle, Users, X } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useState } from 'react'
import DialogRoomCreate from './dialog/dialog-room-create'
import DialogRoomJoin from './dialog/dialog-room-join'
import Tooltip from '@/ui/overlay/tooltip'
import chatViewModel from './chat-viewmodel'
import { formatDate } from '@/utils/time'
import PopoverRoomDetails from './popover/popover-room-details'
import clsx from 'clsx'
import Button from '@/ui/button/button'
import ChatForm from './chat-form'
import ButtonToggle from '@/ui/button/button-toggle'
import ChatScreen from './chat-screen'

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

    const [dialogCreateRoom, setDialogCreateRoom] = useState<boolean>(false)
    const [dialogJoinRoom, setDialogJoinRoom] = useState<boolean>(false)

    return (
        <div className="mx-auto flex h-screen max-w-[96rem] space-x-4 px-8 py-24">
            <div className="flex h-full w-80 flex-col space-y-4">
                <div className="flex items-center justify-between rounded-lg bg-surface p-6 shadow dark:bg-surface-dark">
                    <h1 className="text-center font-semibold">{user?.name}</h1>
                    <Button variant="outline" icon={<LogOut size={20} />} text="Log Out" onClick={() => signOut()} />
                </div>
                <div className="flex flex-grow flex-col space-y-6 overflow-hidden rounded-lg bg-surface p-6 shadow dark:bg-surface-dark">
                    <div className="flex space-x-1">
                        <div>
                            <Tooltip text="Create Room">
                                <Button variant="action" icon={<Plus size={20} />} onClick={() => setDialogCreateRoom(true)} />
                            </Tooltip>
                            <DialogRoomCreate
                                state={dialogCreateRoom}
                                setState={setDialogCreateRoom}
                                onSubmit={(value) => onCreateRoom(value)}
                            />
                        </div>
                        <div>
                            <Tooltip text="Join Room">
                                <Button variant="action" icon={<Link2 size={20} />} onClick={() => setDialogJoinRoom(true)} />
                            </Tooltip>
                            <DialogRoomJoin state={dialogJoinRoom} setState={setDialogJoinRoom} onSubmit={(value) => onJoinRoom(value)} />
                        </div>
                    </div>
                    <div className="flex flex-grow flex-col overflow-scroll">
                        {user?.rooms?.map((room: Room) => (
                            <ButtonToggle
                                key={room.id}
                                text={room.name}
                                toggled={room.id === currentRoom?.id}
                                onClick={() => onConnectToRoom(room)}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex h-full flex-grow flex-col overflow-auto rounded-lg bg-surface shadow dark:bg-surface-dark">
                <div className="flex justify-end space-x-1 p-6">
                    <Tooltip text="Active Users">
                        <Button variant="action" icon={<Users size={20} />} onClick={() => {}} disabled={!currentRoom} />
                    </Tooltip>
                    <PopoverRoomDetails roomId={currentRoom?.id ?? ''}>
                        <Tooltip text="Room Information">
                            <Button variant="action" icon={<HelpCircle size={20} />} onClick={() => {}} disabled={!currentRoom} />
                        </Tooltip>
                    </PopoverRoomDetails>
                    <Tooltip text="Disconnect">
                        <Button variant="action" icon={<X size={20} />} onClick={onDisconnectFromCurrentRoom} disabled={!currentRoom} />
                    </Tooltip>
                </div>
                <ChatScreen messages={messages} disabled={!currentRoom} />
                <ChatForm sending={isSending} disabled={!currentRoom} onSendMessage={onSendMessage} />
            </div>
        </div>
    )
}
