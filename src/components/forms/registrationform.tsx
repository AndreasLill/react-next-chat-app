import { useEffect, useState } from 'react'
import Button from '@/ui/button/button'
import InputText from '@/ui/input/input-text'
import InputPassword from '@/ui/input/input-password'
import Alert from '@/ui/overlay/alert'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'

interface Props {
    onChangeToLogin: () => void
}

const registrationFormSchema = zod.object({
    name: zod
        .string({ required_error: 'Display name is required.' })
        .max(32, { message: 'Display name can be a maximum of 32 characters.' }),
    email: zod
        .string({ required_error: 'Email is required.' })
        .email({ message: 'A valid email address is required.' })
        .max(255, { message: 'Email address can be a maximum of 255 characters.' }),
    password: zod.string({ required_error: 'Password is required.' }).min(8, { message: 'Password must be a minimum of 8 characters.' })
})

interface RegistrationForm {
    name: string
    email: string
    password: string
}

export default function RegistrationForm(props: Props) {
    const {
        register,
        handleSubmit,
        setValue,
        clearErrors,
        formState: { errors }
    } = useForm<RegistrationForm>({ resolver: zodResolver(registrationFormSchema) })
    const [loading, setLoading] = useState<boolean>(false)
    const [success, setSuccess] = useState<boolean>(false)
    const [alert, setAlert] = useState<string>('')

    useEffect(() => {
        register('name')
        register('email')
        register('password')
    }, [])

    const onRegister: SubmitHandler<RegistrationForm> = async (form) => {
        setAlert('')
        setLoading(true)

        const response = await fetch('/api/user/add', {
            method: 'POST',
            body: JSON.stringify({
                name: form.name,
                email: form.email,
                password: form.password
            })
        }).then((res: Response) => res)

        setLoading(false)
        if (response.ok) {
            setSuccess(true)
        } else {
            setAlert(response.statusText)
        }
    }

    if (success) {
        return (
            <div className="mx-auto flex max-w-5xl flex-col items-center px-8 py-24">
                <div className="flex w-96 flex-col space-y-8 rounded-lg bg-surface p-8 shadow dark:bg-surface-dark">
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
            <form
                className="flex w-96 flex-col space-y-8 rounded-lg bg-surface p-8 shadow dark:bg-surface-dark"
                onSubmit={handleSubmit(onRegister)}
            >
                <h1 className="text-center text-xl font-bold">Create a new account</h1>
                <div className="flex flex-col space-y-2">
                    <InputText
                        id="name"
                        label="Display Name"
                        placeholder="Display Name"
                        error={errors.name?.message}
                        onChange={(e) => {
                            if (errors.name) {
                                clearErrors('name')
                            }
                            setValue('name', e.target.value)
                        }}
                    />
                    <InputText
                        id="email"
                        label="Email"
                        placeholder="Email"
                        error={errors.email?.message}
                        onChange={(e) => {
                            if (errors.email) {
                                clearErrors('email')
                            }
                            setValue('email', e.target.value)
                        }}
                    />
                    <InputPassword
                        id="password"
                        label="Password"
                        placeholder="Password"
                        error={errors.password?.message}
                        onChange={(e) => {
                            if (errors.password) {
                                clearErrors('password')
                            }
                            setValue('password', e.target.value)
                        }}
                    />
                </div>
                <Button variant="filled" type="submit" text="Create Account" loading={loading} />
                <div className="flex w-full flex-col items-center space-y-1">
                    <p className="text-center text-sm">Already have an account?</p>
                    <Button variant="subtle" text="Log In" onClick={props.onChangeToLogin} />
                </div>
            </form>
            {alert && <Alert title="Error" text={alert} className="mt-8" />}
        </div>
    )
}
