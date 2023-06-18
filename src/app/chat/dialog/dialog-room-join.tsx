import * as Dialog from '@radix-ui/react-dialog'
import { useState, useEffect, Dispatch, SetStateAction } from 'react'
import ButtonFilled from '@/components/button-filled'
import Input from '@/components/input'
import ButtonGhost from '@/components/button-ghost'

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
        setError('')

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
                <Dialog.Content className="fixed w-96 max-w-lg max-h-96 translate-x-[-50%] translate-y-[-50%] top-[50%] left-[50%] rounded-lg bg-white dark:bg-zinc-900 p-8 transition-all">
                    <Dialog.Title className="mb-8 text-xl">Join a room</Dialog.Title>
                    <form className="flex flex-col" onSubmit={onSubmit}>
                        <Input
                            id="id"
                            type="text"
                            error={error}
                            placeholder="Room ID"
                            className="w-full"
                            value={id}
                            onChange={(e) => setId(e)}
                        />
                        <div className="mt-8 flex space-x-4 justify-end">
                            <ButtonGhost text="Cancel" onClick={() => props.setState(false)} />
                            <ButtonFilled type="submit" text="Join" />
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
