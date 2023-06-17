interface Props {
    type?: 'button' | 'submit'
    text: string
    className?: string
    onClick?: () => void
}

export default function ButtonText(props: Props) {
    return (
        <button
            className={`${props.className} text-center py-3 px-4 text-rose-500 hover:text-rose-500/80 font-semibold text-sm transition-colors`}
            type={props.type ? props.type : 'button'}
            onClick={props.onClick}
        >
            <span>{props.text}</span>
        </button>
    )
}
