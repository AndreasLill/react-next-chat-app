import * as Dialog from '@radix-ui/react-dialog'
import { useState, useEffect } from 'react'
import ButtonFilled from '@/components/button-filled'
import Input from '@/components/input'
import ButtonGhost from '@/components/button-ghost'

interface Props {
    trigger: JSX.Element
    onSubmit: (value: string) => void
}

export default function DialogRoomCreate(props: Props) {
    const [open, setOpen] = useState<boolean>(false)
    const [name, setName] = useState<string>('')
    const [error, setError] = useState<string>('')

    useEffect(() => {
        // Reset states on dialog open and close.
        setError('')
        setName('')
    }, [open])

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError('')

        if (!name.match('^[A-Za-z0-9]{1,32}$')) {
            setError('Please enter a valid name.')
            return
        }

        props.onSubmit(name)
        setOpen(false)
    }

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>{props.trigger}</Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/80 transition-all" />
                <Dialog.Content className="fixed w-96 max-w-lg max-h-96 translate-x-[-50%] translate-y-[-50%] top-[50%] left-[50%] rounded-lg bg-white dark:bg-zinc-900 p-8 transition-all">
                    <Dialog.Title className="mb-8 text-xl">Create a new room</Dialog.Title>
                    <form className="flex flex-col" onSubmit={onSubmit}>
                        <Input
                            id="name"
                            type="text"
                            error={error}
                            placeholder="Room Name"
                            className="w-full"
                            value={name}
                            onChange={(e) => setName(e)}
                        />
                        <div className="mt-8 flex space-x-4 justify-end">
                            <ButtonGhost type="button" text="Cancel" onClick={() => setOpen(false)} />
                            <ButtonFilled type="submit" text="Create" />
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
