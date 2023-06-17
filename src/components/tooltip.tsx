import * as RadixTooltip from '@radix-ui/react-tooltip'

interface Props {
    text: string
}

export default function TooltipContent(props: Props) {
    return (
        <RadixTooltip.Content
            className="bg-zinc-700 text-white px-3 py-2 text-sm select-none rounded-md shadow-lg transition-all"
            sideOffset={6}
        >
            {props.text}
            <RadixTooltip.Arrow className="fill-zinc-700" />
        </RadixTooltip.Content>
    )
}
