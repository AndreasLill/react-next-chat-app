import { useState } from 'react'
import { AlertCircle, Loader2 } from 'lucide-react'
import Input from '@/components/input'
import ButtonFilled from '@/components/button-filled'
import ButtonText from '@/components/button-text'
import Button from '@/ui/button/button'
import InputText from '@/ui/input/input-text'
import InputPassword from '@/ui/input/input-password'
import Alert from '@/ui/overlay/alert'

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
            <div className="mx-auto flex max-w-5xl flex-col items-center px-8 py-24">
                <div className="flex w-96 flex-col space-y-8 rounded-lg bg-white p-8 shadow dark:bg-zinc-900">
                    <div>
                        <h1 className="text-center text-xl">Welcome!</h1>
                        <p className="mt-4 text-center text-sm">Your account has been created.</p>
                    </div>
                    <Button variant="subtle" text="Go Back" onClick={props.onChangeToLogin} />
                </div>
            </div>
        )
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col items-center px-8 py-24">
            <form className="flex w-96 flex-col space-y-8 rounded-lg bg-white p-8 shadow dark:bg-zinc-900" onSubmit={onRegister}>
                <h1 className="text-center text-xl font-bold">Create a new account</h1>
                <div className="flex flex-col space-y-2">
                    <InputText
                        id="name"
                        label="Display Name"
                        placeholder="Display Name"
                        value={name}
                        onChange={(value) => setName(value)}
                    />
                    <InputText id="email" label="Email" placeholder="Email" value={name} onChange={(value) => setEmail(value)} />
                    <InputPassword
                        id="password"
                        label="Password"
                        placeholder="Password"
                        value={password}
                        onChange={(value) => setPassword(value)}
                    />
                </div>
                <Button variant="filled" type="submit" text="Create Account" loading={loading} />
                <div className="flex w-full flex-col items-center">
                    <p className="text-center text-sm">Already have an account?</p>
                    <Button variant="subtle" text="Log In" onClick={props.onChangeToLogin} />
                </div>
            </form>
            {error && <Alert title="Error" text={error} className="mt-8" />}
        </div>
    )
}
