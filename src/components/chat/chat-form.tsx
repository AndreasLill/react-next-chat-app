import Button from '@/ui/button/button'
import InputText from '@/ui/input/input-text'
import { Send } from 'lucide-react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z as zod } from 'zod'
import { useEffect } from 'react'

const chatFormSchema = zod.object({
    message: zod
        .string({ required_error: 'Please enter a chat message.' })
        .min(1, { message: 'Please enter a chat message.' })
        .max(255, { message: 'A chat message can be a maximum of 255 characters.' })
})

interface ChatForm {
    message: string
}

interface Props {
    loading: boolean
    disabled: boolean
    onSendMessage: (value: string) => void
}

export default function ChatForm(props: Props) {
    const {
        register,
        handleSubmit,
        setValue,
        clearErrors,
        watch,
        formState: { errors }
    } = useForm<ChatForm>({ resolver: zodResolver(chatFormSchema) })
    const chatInput = watch('message', '')

    useEffect(() => {
        register('message')
    }, [])

    const onSubmit: SubmitHandler<ChatForm> = (form) => {
        props.onSendMessage(form.message)
        setValue('message', '')
    }

    return (
        <form className="flex space-x-6 p-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex-grow">
                <InputText
                    id="chat"
                    placeholder="Chat Message"
                    autoComplete="off"
                    disabled={props.disabled}
                    className="py-3 text-sm disabled:cursor-not-allowed"
                    error={errors.message?.message}
                    value={chatInput}
                    onChange={(e) => {
                        if (errors.message) {
                            clearErrors('message')
                        }
                        setValue('message', e.target.value)
                    }}
                />
            </div>
            <Button
                variant="filled"
                type="submit"
                icon={<Send size={18} />}
                text="Send"
                className="h-fit py-3"
                loading={props.loading}
                disabled={props.disabled}
            />
        </form>
    )
}
