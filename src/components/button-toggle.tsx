interface Props {
    className?: string
    type?: 'button' | 'submit'
    icon?: JSX.Element
    text?: string
    toggled: boolean
    onClick?: () => void
}

export default function ButtonToggle(props: Props) {
    return (
        <button
            className={`${props.className} flex items-center p-3 space-x-2 font-semibold text-sm border-2 rounded-md ${
                props.toggled ? 'text-primary border-primary' : 'text-on-surface dark:text-on-surface-dark border-transparent'
            } hover:text-primary transition-colors`}
            type={props.type ? props.type : 'button'}
            onClick={props.onClick}
        >
            {props.icon}
            {props.text && <span>{props.text}</span>}
        </button>
    )
}
