import { forwardRef } from 'react'

interface Props {
    icon: JSX.Element
    className?: string
    onClick: () => void
}

// ForwardRef required for RadixUI trigger "asChild".
const ButtonIcon = forwardRef<HTMLButtonElement, Props>((props, forwardedRef) => (
    <button
        className={`${props.className} p-3 font-semibold text-sm rounded-full text-black dark:text-white hover:bg-slate-100 dark:hover:bg-zinc-950 hover:text-rose-500 transition-colors`}
        ref={forwardedRef}
        {...props}
    >
        {props.icon}
    </button>
))

export default ButtonIcon
