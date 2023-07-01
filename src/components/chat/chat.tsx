import { Room } from '@/types/room'
import { LogOut, Plus, Link2, HelpCircle, Users, X } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useState } from 'react'
import DialogRoomCreate from './dialog/dialog-room-create'
import DialogRoomJoin from './dialog/dialog-room-join'
import Tooltip from '@/ui/overlay/tooltip'
import chatViewModel from './chat-viewmodel'
import Button from '@/ui/button/button'
import ChatForm from './chat-form'
import ButtonToggle from '@/ui/button/button-toggle'
import ChatScreen from './chat-screen'
import PopoverRoomUsers from './popover/popover-room-users'

export default function Chat() {
    const {
        user,
        currentRoom,
        sending,
        connecting,
        messages,
        members,
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
                <div className="flex justify-between p-6">
                    <div className="flex flex-col">
                        <p className="text-sm">{currentRoom?.name}</p>
                        <p className="text-xs text-on-surface/50 dark:text-on-surface-dark/50">{currentRoom?.id}</p>
                    </div>
                    <div className="flex space-x-1">
                        <PopoverRoomUsers users={members}>
                            <Tooltip text="Active Users">
                                <Button
                                    variant="action"
                                    text={members?.count.toString()}
                                    icon={<Users size={20} />}
                                    onClick={() => {}}
                                    disabled={!currentRoom || connecting}
                                />
                            </Tooltip>
                        </PopoverRoomUsers>

                        <Tooltip text="Disconnect">
                            <Button
                                variant="action"
                                icon={<X size={20} />}
                                onClick={onDisconnectFromCurrentRoom}
                                disabled={!currentRoom || connecting}
                            />
                        </Tooltip>
                    </div>
                </div>
                <ChatScreen messages={messages} disabled={!currentRoom} />
                <ChatForm loading={sending} disabled={!currentRoom || connecting} onSendMessage={onSendMessage} />
            </div>
        </div>
    )
}
