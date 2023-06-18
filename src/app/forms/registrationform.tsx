import { useState } from 'react'
import { AlertCircle, Loader2 } from 'lucide-react'
import Input from '@/components/input'
import ButtonFilled from '@/components/button-filled'
import ButtonText from '@/components/button-text'

interface Props {
    onChangeToLogin: () => void
}

export default function RegistrationForm(props: Props) {
    const [loading, setLoading] = useState<boolean>(false)
    const [success, setSuccess] = useState<boolean>(false)
    const [error, setError] = useState<string>('')
    const [name, setName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const onRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        const response = await fetch('/api/user/add', {
            method: 'POST',
            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            })
        }).then((res: Response) => res)

        setLoading(false)
        if (response.ok) {
            setSuccess(true)
        } else {
            setError(response.statusText)
        }
    }

    if (success) {
        return (
            <div className="flex flex-col items-center mx-auto max-w-5xl px-8 py-24">
                <div className="flex flex-col w-96 p-8 bg-white dark:bg-zinc-900 rounded-lg shadow space-y-8">
                    <div>
                        <h1 className="text-center text-xl">Welcome!</h1>
                        <p className="mt-4 text-center text-sm">Your account has been created.</p>
                    </div>
                    <ButtonText text="Go Back" onClick={props.onChangeToLogin} />
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center mx-auto max-w-7xl px-8 py-24">
            <form className="flex flex-col w-96 p-8 bg-white dark:bg-zinc-900 rounded-lg shadow space-y-8" onSubmit={onRegister}>
                <h1 className="text-center font-bold text-xl">Create a new account</h1>
                <div className="flex flex-col space-y-2">
                    <Input
                        id="name"
                        type="text"
                        label="Display Name"
                        placeholder="Display Name"
                        className="w-full"
                        value={name}
                        onChange={(e) => setName(e)}
                    />
                    <Input
                        id="email"
                        type="text"
                        label="Email"
                        placeholder="Email"
                        className="w-full"
                        value={email}
                        onChange={(e) => setEmail(e)}
                    />
                    <Input
                        id="password"
                        type="password"
                        label="Password"
                        placeholder="Password"
                        className="w-full"
                        value={password}
                        onChange={(e) => setPassword(e)}
                    />
                </div>
                <ButtonFilled
                    className="w-full justify-center"
                    type="submit"
                    icon={loading ? <Loader2 className="animate-spin" size={20} /> : null}
                    text="Create Account"
                />
                <div className="flex flex-col w-full items-center">
                    <p className="text-center text-sm">Already have an account?</p>
                    <ButtonText text="Log In" onClick={props.onChangeToLogin} />
                </div>
            </form>
            {error && (
                <div className="flex p-6 space-x-2 items-center">
                    <AlertCircle className="text-red-500 dark:text-red-400" size={20} />
                    <p className="text-red-500 dark:text-red-400">{error}</p>
                </div>
            )}
        </div>
    )
}
