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
            className={`${props.className} p-3 cursor-pointer select-none rounded-xl text-sm font-semibold ${
                props.toggled ? 'text-rose-500 bg-slate-200 dark:bg-zinc-950' : 'text-black dark:text-white'
            } hover:text-rose-500 transition-all`}
            onClick={props.onClick}
        >
            <span>{props.text}</span>
        </li>
    )
}
