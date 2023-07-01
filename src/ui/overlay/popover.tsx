import * as RadixPopover from '@radix-ui/react-popover'
import { forwardRef } from 'react'

interface Props {
    side?: 'top' | 'bottom' | 'left' | 'right'
    trigger: JSX.Element
    children: JSX.Element
}

const Popover = forwardRef<HTMLDivElement, Props>((props, forwardedRef) => {
    return (
        <div ref={forwardedRef} {...props}>
            <RadixPopover.Root>
                <RadixPopover.Trigger asChild>{props.trigger}</RadixPopover.Trigger>
                <RadixPopover.Portal>
                    <RadixPopover.Content
                        side={props.side}
                        sideOffset={6}
                        className={`z-50 max-h-96 max-w-xl overflow-y-scroll rounded-lg border border-on-surface/20 bg-surface p-4 shadow dark:border-on-surface-dark/20 dark:bg-surface-dark`}
                    >
                        {props.children}
                    </RadixPopover.Content>
                </RadixPopover.Portal>
            </RadixPopover.Root>
        </div>
    )
})

export default Popover
