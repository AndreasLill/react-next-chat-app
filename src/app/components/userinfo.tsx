import { signOut, useSession } from "next-auth/react";

export default function UserInfo() {
    const { data: session, status } = useSession()

    if (session?.user) {
        return (
            <div className="flex flex-col w-full max-w-sm dark:bg-slate-950">
                <div className="flex w-full p-6 justify-between">
                    <div className="flex w-full items-center justify-start">
                        <h1 className="dark:text-white font-bold text-lg">{session.user.name}</h1>
                    </div>
                    <div className="flex w-full items-center justify-end">
                        <button className="dark:text-white" onClick={() => signOut()}>Log Out</button>
                    </div>
                </div>
            </div>
        )
    }
}