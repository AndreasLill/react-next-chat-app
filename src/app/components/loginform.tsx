import { signIn } from 'next-auth/react'
import { useRef } from 'react'

export default function LoginForm() {
    const username = useRef<HTMLInputElement>(null)
    const password = useRef<HTMLInputElement>(null)

    const onLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const response = await signIn('credentials', {
            username: username.current?.value,
            password: password.current?.value,
            redirect: false
        })
        if (response?.error === 'CredentialsSignin') {
            console.log('wrong username or password.')
        }
    }

    return (
        <form className="flex flex-col w-96 p-8" onSubmit={(e) => onLogin(e)}>
            <h1 className="mb-4 text-center dark:text-white font-bold text-2xl">Log in to your account</h1>
            <div className="mt-8">
                <label htmlFor="username" className="block dark:text-white text-sm">
                    Username
                </label>
                <input
                    id="username"
                    ref={username}
                    type="text"
                    className="w-full px-3 py-2 mt-2 border rounded focus:outline-none focus:outline-offset-0 focus:outline-purple-700"
                />
                <label htmlFor="password" className="block mt-4 dark:text-white text-sm">
                    Password
                </label>
                <input
                    id="password"
                    ref={password}
                    type="password"
                    className="w-full px-3 py-2 mt-2 border rounded focus:outline-none focus:outline-offset-0 focus:outline-purple-700"
                />
            </div>
            <button type="submit" className="mt-8 p-3 bg-purple-800 hover:bg-purple-700 text-white font-semibold text-sm rounded">
                Log In
            </button>
        </form>
    )
}
