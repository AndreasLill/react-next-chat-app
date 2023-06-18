import * as RadixTooltip from '@radix-ui/react-tooltip'

interface Props {
    children: JSX.Element
    text: string
}

export default function Tooltip(props: Props) {
    return (
        <div>
            <RadixTooltip.Provider>
                <RadixTooltip.Root>
                    <RadixTooltip.Trigger asChild>{props.children}</RadixTooltip.Trigger>
                    <RadixTooltip.Content
                        className="bg-zinc-700 text-white px-3 py-2 text-sm select-none rounded-md shadow-lg transition-all"
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
    )
}
