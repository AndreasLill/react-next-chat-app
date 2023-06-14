import { UserCircle, Plus, LogOut } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'

export default function Chat() {
    const { data: session, status } = useSession()

    return (
        <div className="flex mx-auto max-w-5xl px-8 py-24 space-x-4">
            <div className="flex flex-col w-80 h-[48rem] p-8 bg-neutral-100 dark:bg-neutral-800 rounded-lg shadow space-y-4">
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
                <button type="submit" className="w-full p-3 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-sm rounded">
                    <div className="flex w-full space-x-2">
                        <Plus size={20} />
                        <p>Create Room</p>
                    </div>
                </button>
            </div>
            <div className="flex flex-col flex-grow h-[48rem] p-8 bg-neutral-100 dark:bg-neutral-800 rounded-lg shadow">
                <p>Chat Box Here</p>
            </div>
        </div>
    )
}
