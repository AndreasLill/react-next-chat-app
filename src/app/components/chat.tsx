import { User } from '@/types/user'
import { Room } from '@/types/room'
import { UserCircle, Plus, LogOut } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { useEffect } from 'react'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url, { method: 'GET' }).then((res: Response) => res.json())

export default function Chat() {
    const { data: session } = useSession()
    const { data: user } = useSWR<User>('/api/user', fetcher)

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
        <div className="flex mx-auto max-w-5xl px-8 py-24 space-x-4">
            <div className="flex flex-col w-80 h-[48rem] p-8 bg-white dark:bg-neutral-800 rounded-lg shadow space-y-4">
                <div className="flex justify-between w-full h-16">
                    <div className="flex w-full justify-start items-center space-x-2">
                        <UserCircle />
                        <h1 className="font-bold text-sm">{session?.user?.id}</h1>
                    </div>
                    <div className="flex w-full items-center justify-end">
                        <button onClick={() => signOut()}>
                            <LogOut />
                        </button>
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full p-3 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-sm rounded"
                    onClick={() => onCreateRoom('room123')}
                >
                    <div className="flex w-full space-x-2">
                        <Plus size={20} />
                        <p>Create Room</p>
                    </div>
                </button>
                {user?.rooms.map((room: Room) => (
                    <p key={room.id}>{room.name}</p>
                ))}
            </div>
            <div className="flex flex-col flex-grow h-[48rem] p-8 bg-white dark:bg-neutral-800 rounded-lg shadow">
                <p>Chat Box Here</p>
            </div>
        </div>
    )
}
