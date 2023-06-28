import * as RadixDialog from '@radix-ui/react-dialog'
import { Dispatch, SetStateAction, forwardRef } from 'react'

interface Props {
    children: JSX.Element
    state: boolean
    setState: Dispatch<SetStateAction<boolean>>
    title: string
}

const Dialog = forwardRef<HTMLDivElement, Props>(({ title, state, setState, children, ...props }, forwardedRef) => {
    return (
        <div ref={forwardedRef} {...props}>
            <RadixDialog.Root open={state} onOpenChange={setState}>
                <RadixDialog.Portal>
                    <RadixDialog.Overlay className="fixed inset-0 bg-black/60 radix-state-open:animate-opacity" />
                    <RadixDialog.Content className="fixed left-[50%] top-[50%] max-h-96 w-96 max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-lg bg-surface p-8 radix-state-open:animate-opacity-scale dark:bg-surface-dark">
                        <RadixDialog.Title className="mb-8 text-xl">{title}</RadixDialog.Title>
                        {children}
                    </RadixDialog.Content>
                </RadixDialog.Portal>
            </RadixDialog.Root>
        </div>
    )
})

export default Dialog
