interface Props {
    type?: 'button' | 'submit'
    icon?: JSX.Element | null
    text?: string
    className?: string
    onClick?: () => void
}

export default function ButtonGhost(props: Props) {
    return (
        <button
            className={`${props.className} flex items-center p-3 space-x-2 font-semibold text-sm rounded-md text-on-surface dark:text-on-surface-dark hover:bg-background dark:hover:bg-background-dark hover:text-primary transition-colors`}
            type={props.type ? props.type : 'button'}
            onClick={props.onClick}
        >
            {props.icon}
            {props.text && <span>{props.text}</span>}
        </button>
    )
}
