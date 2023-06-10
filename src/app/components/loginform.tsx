import { signIn } from "next-auth/react"
import { useRef } from "react"

export default function LoginForm() {

    const username = useRef<HTMLInputElement>(null)
    const password = useRef<HTMLInputElement>(null)

    const onLogin = async() => {
        signIn("credentials", {
            username: username.current?.value,
            password: password.current?.value,
            redirect: false,
        })
    }

    return (
        <div className="flex flex-col w-96 p-8 space-y-8">
            <h1 className="block mb-4 text-center dark:text-white font-bold text-2xl">Log in to your account</h1>
            <div>
                <label htmlFor="username" className="block dark:text-white text-sm">Username</label>
                <input id="username" ref={username} type="text" className="w-full px-3 py-2 mt-2 border rounded focus:outline-none focus:outline-offset-0 focus:outline-purple-700" />
                <label htmlFor="password" className="block mt-4 dark:text-white text-sm">Password</label>
                <input id="password" ref={password} type="password" className="w-full px-3 py-2 mt-2 border rounded focus:outline-none focus:outline-offset-0 focus:outline-purple-700" />
            </div>
            <button className="block h-10 bg-purple-800 hover:bg-purple-700 text-white font-semibold text-sm rounded" onClick={onLogin}>Log In</button>
        </div>
    )
}