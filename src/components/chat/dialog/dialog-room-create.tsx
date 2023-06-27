import * as Dialog from '@radix-ui/react-dialog'
import { useState, useEffect, SetStateAction, Dispatch } from 'react'
import Button from '@/ui/button/button'
import InputText from '@/ui/input/input-text'

interface Props {
    state: boolean
    setState: Dispatch<SetStateAction<boolean>>
    onSubmit: (value: string) => void
}

export default function DialogRoomCreate(props: Props) {
    const [name, setName] = useState<string>('')
    const [error, setError] = useState<string>('')

    useEffect(() => {
        // Reset states on dialog open and close.
        setError('')
        setName('')
    }, [open])

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!name.match('^[A-Za-z0-9]{1,32}$')) {
            console.log('error')
            setError('Please enter a name between 1-32 characters.')
            return
        }

        props.onSubmit(name)
        props.setState(false)
    }

    return (
        <Dialog.Root open={props.state} onOpenChange={props.setState}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/80 transition-all" />
                <Dialog.Content className="fixed left-[50%] top-[50%] max-h-96 w-96 max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-8 transition-all dark:bg-zinc-900">
                    <Dialog.Title className="mb-8 text-xl">Create a new room</Dialog.Title>
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
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
