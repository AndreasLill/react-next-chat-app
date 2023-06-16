interface Props {
    type?: 'button' | 'submit'
    icon?: JSX.Element | null
    text?: string | null
    className?: string
    onClick?: () => void
}

export default function ButtonFilled(props: Props) {
    return (
        <button
            className={`${props.className} flex items-center p-3 space-x-2 font-semibold text-sm rounded-md bg-primary text-on-primary hover:bg-primary/70 transition-colors`}
            type={props.type ? props.type : 'button'}
            onClick={props.onClick}
        >
            {props.icon}
            {props.text && <span>{props.text}</span>}
        </button>
    )
}
