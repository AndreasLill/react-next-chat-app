interface Props {
    icon: JSX.Element
    className?: string
    onClick?: () => void
}

export default function ButtonIcon(props: Props) {
    return (
        <button
            className={`${props.className} p-3 font-semibold text-sm rounded-full text-black dark:text-white hover:bg-slate-100 dark:hover:bg-zinc-950 hover:text-rose-500 transition-colors`}
            onClick={props.onClick}
        >
            {props.icon}
        </button>
    )
}
