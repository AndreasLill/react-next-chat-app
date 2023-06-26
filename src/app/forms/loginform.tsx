import { signIn } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Button from '@/ui/button/button'
import InputText from '@/ui/input/input-text'
import InputPassword from '@/ui/input/input-password'
import Alert from '@/ui/overlay/alert'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'

interface Props {
    onChangeToRegistration: () => void
}

const loginFormSchema = zod.object({
    email: zod.string({ required_error: 'Email is required.' }).email({ message: 'A valid email address is required.' }),
    password: zod.string({ required_error: 'Password is required.' })
})

interface LoginForm {
    email: string
    password: string
}

export default function LoginForm(props: Props) {
    const {
        register,
        handleSubmit,
        setValue,
        clearErrors,
        formState: { errors }
    } = useForm<LoginForm>({ resolver: zodResolver(loginFormSchema) })
    const [loading, setLoading] = useState<boolean>(false)
    const [alert, setAlert] = useState<string>('')

    useEffect(() => {
        register('email')
        register('password')
    }, [])

    const onLogin: SubmitHandler<LoginForm> = async (form) => {
        setAlert('')
        setLoading(true)
        const response = await signIn('credentials', {
            username: form.email,
            password: form.password,
            redirect: false
        })
        setLoading(false)
        if (response?.error === 'CredentialsSignin') {
            setAlert('Incorrect email or password.')
        }
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col items-center px-8 py-24">
            <form
                className="flex w-96 flex-col space-y-8 rounded-lg bg-surface p-8 shadow dark:bg-surface-dark"
                onSubmit={handleSubmit(onLogin)}
            >
                <h1 className="text-center text-xl font-bold">Log in to your account</h1>
                <div className="flex flex-col space-y-2">
                    <InputText
                        id="email"
                        label="Email"
                        placeholder="Email"
                        error={errors.email?.message}
                        onChange={(value) => {
                            clearErrors('email')
                            setValue('email', value)
                        }}
                    />
                    <InputPassword
                        id="password"
                        label="Password"
                        placeholder="Password"
                        error={errors.password?.message}
                        onChange={(value) => {
                            clearErrors('password')
                            setValue('password', value)
                        }}
                    />
                </div>
                <div className="flex flex-col space-y-4">
                    <Button variant="filled" type="submit" text="Log In" loading={loading} />
                    <Button variant="subtle" text="Create Account" onClick={props.onChangeToRegistration} />
                </div>
            </form>
            {alert && <Alert title="Error" text={alert} className="mt-8" />}
        </div>
    )
}
