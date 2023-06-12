import { ApiResponse } from '@/types/api'
import { useRef, useState } from 'react'
import { AlertCircle, Loader2 } from 'lucide-react'

interface Props {
    onChangeToLogin: () => void
}

export default function RegistrationForm(props: Props) {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>('')
    const [username, setUsername] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const onRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        const response: ApiResponse = await fetch('/api/user/register', {
            method: 'POST',
            body: JSON.stringify({
                username: username,
                email: email,
                password: password
            })
        }).then((res: Response) => res.json())
        setLoading(false)
        if (response.error) {
            setError(response.error)
        }
    }

    return (
        <div className="flex flex-col items-center mx-auto max-w-5xl px-8 py-24">
            <form className="flex flex-col w-96 p-8 bg-neutral-100 dark:bg-zinc-800 rounded-lg shadow space-y-8" onSubmit={onRegister}>
                <h1 className="text-center dark:text-white font-bold text-xl">Create a new account</h1>
                <div>
                    <label htmlFor="username" className="block dark:text-white text-sm">
                        Username
                    </label>
                    <input
                        id="username"
                        type="text"
                        placeholder="Username"
                        className="w-full px-3 py-2 mt-2 border rounded focus:outline-none focus:outline-offset-0 focus:outline-emerald-700"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <label htmlFor="reg-email" className="block mt-4 dark:text-white text-sm">
                        Email
                    </label>
                    <input
                        id="email"
                        type="text"
                        placeholder="Email"
                        className="w-full px-3 py-2 mt-2 border rounded focus:outline-none focus:outline-offset-0 focus:outline-emerald-700"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label htmlFor="reg-password" className="block mt-4 dark:text-white text-sm">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Password"
                        className="w-full px-3 py-2 mt-2 border rounded focus:outline-none focus:outline-offset-0 focus:outline-emerald-700"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" className="w-full p-3 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-sm rounded">
                    <div className="flex w-full items-center justify-center space-x-2">
                        {loading && <Loader2 className="animate-spin" size={20} />}
                        <p>Create Account</p>
                    </div>
                </button>
                <div className="flex flex-col w-full items-center">
                    <p className="text-center text-sm dark:text-white">Already have an account?</p>
                    <button
                        className="text-center px-4 py-2 text-emerald-700 hover:text-emerald-600 font-semibold text-sm rounded"
                        type="button"
                        onClick={props.onChangeToLogin}
                    >
                        Login
                    </button>
                </div>
            </form>
            {error && (
                <div className="flex p-6 space-x-2 items-center">
                    <AlertCircle className="text-red-600 dark:text-red-400" size={20} />
                    <p className="text-red-600 dark:text-red-400">{error}</p>
                </div>
            )}
        </div>
    )
}
