import * as Popover from '@radix-ui/react-popover'

interface Props {
    children: JSX.Element
    roomId: string
}

export default function PopoverRoomDetails(props: Props) {
    return (
        <Popover.Root>
            <Popover.Trigger asChild>{props.children}</Popover.Trigger>
            <Popover.Portal>
                <Popover.Content
                    side="bottom"
                    sideOffset={6}
                    className={`flex flex-col bg-zinc-800 border border-black/20 dark:border-white/20 rounded-lg shadow-lg p-4 z-50`}
                >
                    <label htmlFor="id" className="mb-2 text-sm">
                        Room ID
                    </label>
                    <p id="id" className="py-3 px-4 bg-slate-100 dark:bg-zinc-950 border border-black/20 dark:border-white/20">
                        {props.roomId}
                    </p>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    )
}
