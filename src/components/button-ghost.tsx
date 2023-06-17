interface Props {
    type?: 'button' | 'submit'
    icon?: JSX.Element | null
    text: string
    className?: string
    onClick?: () => void
}

export default function ButtonGhost(props: Props) {
    return (
        <button
            className={`${props.className} flex items-center py-3 px-4 space-x-2 font-semibold text-sm rounded-md text-black dark:text-white hover:bg-slate-100 dark:hover:bg-zinc-950 hover:text-rose-500 transition-colors`}
            type={props.type ? props.type : 'button'}
            onClick={props.onClick}
        >
            {props.icon}
            <span>{props.text}</span>
        </button>
    )
}
