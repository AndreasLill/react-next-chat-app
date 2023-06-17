interface Props {
    type?: 'button' | 'submit'
    icon?: JSX.Element | null
    text: string | null
    className?: string
    onClick?: () => void
}

export default function ButtonFilled(props: Props) {
    return (
        <button
            className={`${props.className} flex items-center py-3 px-4 space-x-2 font-semibold text-sm rounded-md bg-rose-500 text-white hover:bg-rose-500/80 transition-colors`}
            type={props.type ? props.type : 'button'}
            onClick={props.onClick}
        >
            {props.icon}
            <span>{props.text}</span>
        </button>
    )
}
