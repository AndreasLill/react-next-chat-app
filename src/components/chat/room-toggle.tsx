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
            className={`${props.className} p-3 cursor-pointer select-none rounded-xl text-sm font-semibold border-2 ${
                props.toggled ? 'text-rose-500 border-rose-500' : 'text-black dark:text-white border-transparent'
            } hover:text-rose-500 transition-all`}
            onClick={props.onClick}
        >
            <span>{props.text}</span>
        </li>
    )
}
