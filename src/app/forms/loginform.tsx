import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { AlertCircle, Loader2 } from 'lucide-react'
import ButtonFilled from '@/components/button-filled'
import Input from '@/components/input'
import ButtonText from '@/components/button-text'

interface Props {
    onChangeToRegistration: () => void
}

export default function LoginForm(props: Props) {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const onLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        const response = await signIn('credentials', {
            username: email,
            password: password,
            redirect: false
        })
        setLoading(false)
        if (response?.error === 'CredentialsSignin') {
            setError('Incorrect email or password.')
            setPassword('')
        }
    }

    return (
        <div className="flex flex-col items-center mx-auto max-w-7xl px-8 py-24">
            <form className="flex flex-col w-96 p-8 bg-surface dark:bg-surface-dark rounded-lg shadow space-y-8" onSubmit={onLogin}>
                <h1 className="text-center font-bold text-xl">Log in to your account</h1>
                <div className="flex flex-col space-y-2">
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
                    text="Log In"
                />
                <div className="flex flex-col w-full items-center">
                    <p className="text-center text-sm">No account yet?</p>
                    <ButtonText text="Create Account" onClick={props.onChangeToRegistration} />
                </div>
            </form>
            {error && (
                <div className="flex p-6 space-x-2 items-center">
                    <AlertCircle className="text-error dark:text-error-dark" size={20} />
                    <p className="text-error dark:text-error-dark">{error}</p>
                </div>
            )}
        </div>
    )
}
