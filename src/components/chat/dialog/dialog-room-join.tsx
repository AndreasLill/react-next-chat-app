import * as Dialog from '@radix-ui/react-dialog'
import { useState, useEffect, Dispatch, SetStateAction } from 'react'
import Button from '@/ui/button/button'
import InputText from '@/ui/input/input-text'

interface Props {
    state: boolean
    setState: Dispatch<SetStateAction<boolean>>
    onSubmit: (value: string) => void
}

export default function DialogRoomJoin(props: Props) {
    const [id, setId] = useState<string>('')
    const [error, setError] = useState<string>('')

    useEffect(() => {
        // Reset states on dialog open and close.
        setError('')
        setId('')
    }, [open])

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!id.match('^[{]?[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}[}]?$')) {
            setError('Please enter a valid room ID.')
            return
        }

        props.onSubmit(id)
        props.setState(false)
    }

    return (
        <Dialog.Root open={props.state} onOpenChange={props.setState}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/80 transition-all" />
                <Dialog.Content className="fixed left-[50%] top-[50%] max-h-96 w-96 max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-8 transition-all dark:bg-zinc-900">
                    <Dialog.Title className="mb-8 text-xl">Join a room</Dialog.Title>
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
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
