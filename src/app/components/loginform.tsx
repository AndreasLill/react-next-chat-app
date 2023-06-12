import { ApiResponse } from '@/types/api'
import { signIn } from 'next-auth/react'
import { useRef, useState } from 'react'
import { AlertCircle, Loader2 } from 'lucide-react'

export default function LoginForm() {
    const [loginTab, setLoginTab] = useState<boolean>(true)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<boolean>(false)
    const loginUsername = useRef<HTMLInputElement>(null)
    const loginPassword = useRef<HTMLInputElement>(null)
    const registerUsername = useRef<HTMLInputElement>(null)
    const registerEmail = useRef<HTMLInputElement>(null)
    const registerPassword = useRef<HTMLInputElement>(null)

    const onLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(false)
        setLoading(true)
        const response = await signIn('credentials', {
            username: loginUsername.current?.value,
            password: loginPassword.current?.value,
            redirect: false
        })
        setLoading(false)
        if (response?.error === 'CredentialsSignin') {
            setError(true)
            console.log('wrong username or password.')
        }
    }

    const onRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const response: ApiResponse = await fetch('/api/user/register', {
            method: 'POST',
            body: JSON.stringify({
                username: registerUsername.current?.value,
                email: registerEmail.current?.value,
                password: registerPassword.current?.value
            })
        }).then((res: Response) => res.json())
        console.log(response)
    }

    if (loginTab) {
        return (
            <>
                <form className="flex flex-col w-96 p-8 bg-neutral-100 dark:bg-zinc-800 rounded-lg shadow space-y-8" onSubmit={onLogin}>
                    <h1 className="text-center dark:text-white font-bold text-xl">Log in to your account</h1>
                    <div>
                        <label htmlFor="login-username" className="block dark:text-white text-sm">
                            Username
                        </label>
                        <input
                            id="login-username"
                            name="username"
                            ref={loginUsername}
                            type="text"
                            placeholder="Username"
                            className="w-full px-3 py-2 mt-2 border rounded focus:outline-none focus:outline-offset-0 focus:outline-emerald-700"
                        />
                        <label htmlFor="login-password" className="block mt-4 dark:text-white text-sm">
                            Password
                        </label>
                        <input
                            id="login-password"
                            name="password"
                            ref={loginPassword}
                            type="password"
                            placeholder="Password"
                            className="w-full px-3 py-2 mt-2 border rounded focus:outline-none focus:outline-offset-0 focus:outline-emerald-700"
                        />
                    </div>
                    <button type="submit" className="w-full p-3 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-sm rounded">
                        <div className="flex w-full items-center justify-center space-x-2">
                            {loading && <Loader2 className="animate-spin" size={20} />}
                            <p>Log In</p>
                        </div>
                    </button>
                    <div className="flex flex-col w-full items-center">
                        <p className="text-center text-sm dark:text-white">No account yet?</p>
                        <button
                            className="text-center px-4 py-2 text-emerald-700 hover:text-emerald-600 font-semibold text-sm rounded"
                            type="button"
                            onClick={() => setLoginTab(false)}
                        >
                            Register
                        </button>
                    </div>
                </form>
                {error && (
                    <div className="flex m-8 p-6 bg-red-100 rounded-lg space-x-2 items-center">
                        <AlertCircle className="text-red-800" size={20} />
                        <p className="text-red-800">Incorrect username or password.</p>
                    </div>
                )}
            </>
        )
    }

    return (
        <>
            <form className="flex flex-col w-96 p-8 bg-neutral-100 dark:bg-zinc-800 rounded-lg shadow space-y-8" onSubmit={onRegister}>
                <h1 className="text-center dark:text-white font-bold text-xl">Register a new account</h1>
                <div>
                    <label htmlFor="reg-username" className="block dark:text-white text-sm">
                        Username
                    </label>
                    <input
                        id="reg-username"
                        name="username"
                        ref={registerUsername}
                        type="text"
                        placeholder="Username"
                        className="w-full px-3 py-2 mt-2 border rounded focus:outline-none focus:outline-offset-0 focus:outline-emerald-700"
                    />
                    <label htmlFor="reg-email" className="block mt-4 dark:text-white text-sm">
                        Email
                    </label>
                    <input
                        id="reg-email"
                        name="email"
                        ref={registerEmail}
                        type="text"
                        placeholder="Email"
                        className="w-full px-3 py-2 mt-2 border rounded focus:outline-none focus:outline-offset-0 focus:outline-emerald-700"
                    />
                    <label htmlFor="reg-password" className="block mt-4 dark:text-white text-sm">
                        Password
                    </label>
                    <input
                        id="reg-password"
                        name="password"
                        ref={registerPassword}
                        type="password"
                        placeholder="Password"
                        className="w-full px-3 py-2 mt-2 border rounded focus:outline-none focus:outline-offset-0 focus:outline-emerald-700"
                    />
                </div>
                <button type="submit" className="w-full p-3 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-sm rounded">
                    Register
                </button>
                <div className="flex flex-col w-full items-center">
                    <p className="text-center text-sm dark:text-white">Already have an account?</p>
                    <button
                        className="text-center px-4 py-2 text-emerald-700 hover:text-emerald-600 font-semibold text-sm rounded"
                        type="button"
                        onClick={() => setLoginTab(true)}
                    >
                        Login
                    </button>
                </div>
            </form>
        </>
    )
}
