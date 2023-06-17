interface Props {
    className?: string
    type?: 'button' | 'submit'
    text?: string
    toggled: boolean
    onClick?: () => void
}

export default function RoomToggle(props: Props) {
    return (
        <li
            className={`${props.className} flex items-center space-x-2 cursor-pointer select-none ${
                props.toggled ? 'text-rose-500 font-semibold ' : 'text-black dark:text-white'
            } hover:text-rose-500 transition-colors`}
            onClick={props.onClick}
        >
            <div
                className={`h-10 border ${props.toggled ? 'border-rose-500' : 'border-slate-100 dark:border-zinc-950'} transition-colors`}
            />
            {props.text && <span className="p-3">{props.text}</span>}
        </li>
    )
}
