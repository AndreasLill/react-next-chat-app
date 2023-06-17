import * as RadixTooltip from '@radix-ui/react-tooltip'
import TooltipContent from './tooltip'

interface Props {
    icon: JSX.Element
    tooltip?: string
    className?: string
    onClick?: () => void
}

export default function ButtonIcon(props: Props) {
    return (
        <RadixTooltip.Provider>
            <RadixTooltip.Root>
                <RadixTooltip.Trigger asChild>
                    <button
                        className={`${props.className} p-3 font-semibold text-sm rounded-full text-black dark:text-white hover:bg-slate-100 dark:hover:bg-zinc-950 hover:text-rose-500 transition-colors`}
                        onClick={props.onClick}
                    >
                        {props.icon}
                    </button>
                </RadixTooltip.Trigger>
                <RadixTooltip.Portal>{props.tooltip && <TooltipContent text={props.tooltip} />}</RadixTooltip.Portal>
            </RadixTooltip.Root>
        </RadixTooltip.Provider>
    )
}
