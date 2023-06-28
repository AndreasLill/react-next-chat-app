import { useState, useEffect, SetStateAction, Dispatch } from 'react'
import Button from '@/ui/button/button'
import InputText from '@/ui/input/input-text'
import Dialog from '@/ui/overlay/dialog'
import { z as zod } from 'zod'

interface Props {
    state: boolean
    setState: Dispatch<SetStateAction<boolean>>
    onSubmit: (value: string) => void
}

export default function DialogRoomCreate(props: Props) {
    const [name, setName] = useState<string>('')
    const [error, setError] = useState<string>('')

    useEffect(() => {
        setError('')
        setName('')
    }, [props.state])

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const result = zod.string().min(1).max(32).safeParse(name)
        if (!result.success) {
            setError('Please enter a name between 1-32 characters.')
            return
        }

        props.onSubmit(name)
        props.setState(false)
    }

    return (
        <Dialog state={props.state} setState={props.setState} title="Create a new room">
            <form className="flex flex-col" onSubmit={onSubmit}>
                <InputText
                    id="name"
                    label="Name"
                    placeholder="Room Name"
                    className="w-full"
                    error={error}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <div className="mt-8 flex justify-end space-x-4">
                    <Button variant="subtle" text="Cancel" onClick={() => props.setState(false)} />
                    <Button variant="filled" type="submit" text="Create" />
                </div>
            </form>
        </Dialog>
    )
}
