import * as RadixTooltip from '@radix-ui/react-tooltip'
import { forwardRef } from 'react'

interface Props {
    children: JSX.Element
    text: string
}

const Tooltip = forwardRef<HTMLDivElement, Props>((props, forwardedRef) => (
    <div ref={forwardedRef} {...props}>
        <RadixTooltip.Provider>
            <RadixTooltip.Root>
                <RadixTooltip.Trigger asChild>{props.children}</RadixTooltip.Trigger>
                <RadixTooltip.Content
                    className="select-none rounded-md bg-zinc-700 px-3 py-2 text-sm text-white shadow-lg transition-all"
                    align="center"
                    side="top"
                    sideOffset={6}
                >
                    {props.text}
                    <RadixTooltip.Arrow className="fill-zinc-700" />
                </RadixTooltip.Content>
            </RadixTooltip.Root>
        </RadixTooltip.Provider>
    </div>
))

export default Tooltip
