import { signIn } from 'next-auth/react'
import { useState } from 'react'
import Button from '@/ui/button/button'
import InputText from '@/ui/input/input-text'
import InputPassword from '@/ui/input/input-password'
import Alert from '@/ui/overlay/alert'

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

        if (loading) {
            return
        }

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
        <div className="mx-auto flex max-w-7xl flex-col items-center px-8 py-24">
            <form className="flex w-96 flex-col space-y-8 rounded-lg bg-white p-8 shadow dark:bg-zinc-900" onSubmit={onLogin}>
                <h1 className="text-center text-xl font-bold">Log in to your account</h1>
                <div className="flex flex-col space-y-2">
                    <InputText id="email" label="Email" placeholder="Email" value={email} onChange={(value) => setEmail(value)} />
                    <InputPassword
                        id="password"
                        label="Password"
                        placeholder="Password"
                        value={password}
                        onChange={(value) => setPassword(value)}
                    />
                </div>
                <div className="flex flex-col space-y-4">
                    <Button variant="filled" type="submit" text="Log In" loading={loading} />
                    <Button variant="subtle" text="Create Account" onClick={props.onChangeToRegistration} />
                </div>
            </form>
            {error && <Alert title="Error" text={error} className="mt-8" />}
        </div>
    )
}
