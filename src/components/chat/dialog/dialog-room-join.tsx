import { useState, useEffect, Dispatch, SetStateAction } from 'react'
import Button from '@/ui/button/button'
import InputText from '@/ui/input/input-text'
import Dialog from '@/ui/overlay/dialog'
import { z as zod } from 'zod'

interface Props {
    state: boolean
    setState: Dispatch<SetStateAction<boolean>>
    onSubmit: (value: string) => void
}

export default function DialogRoomJoin(props: Props) {
    const [id, setId] = useState<string>('')
    const [error, setError] = useState<string>('')

    useEffect(() => {
        setError('')
        setId('')
    }, [props.state])

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const result = zod.string().uuid().safeParse(id)
        if (!result.success) {
            setError('Please enter a valid room ID.')
            return
        }

        props.onSubmit(id)
        props.setState(false)
    }

    return (
        <Dialog state={props.state} setState={props.setState} title="Join a room">
            <form className="flex flex-col" onSubmit={onSubmit}>
                <InputText
                    id="id"
                    label="Room"
                    placeholder="Room ID"
                    className="w-full"
                    error={error}
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                />
                <div className="mt-8 flex justify-end space-x-4">
                    <Button variant="subtle" text="Cancel" onClick={() => props.setState(false)} />
                    <Button variant="filled" type="submit" text="Join" />
                </div>
            </form>
        </Dialog>
    )
}
