import clsx from 'clsx'
import { Loader2 } from 'lucide-react'
import { forwardRef } from 'react'

interface Props {
    variant: 'filled' | 'outline' | 'subtle'
    type?: 'button' | 'submit'
    icon?: JSX.Element
    text?: string
    loading?: boolean
    disabled?: boolean
    className?: string
    onClick?: () => void
}

const defaultFilledStyle = clsx(
    'rounded-md border border-transparent py-2 px-3 text-sm font-semibold outline-none focus-visible:outline-rose-500 text-white bg-rose-500 hover:bg-rose-500/80 active:translate-y-[1px] transition-colors'
)
const disabledFilledStyle = clsx(
    'rounded-md border border-transparent py-2 px-3 text-sm font-semibold outline-none focus-visible:outline-rose-500 text-white/60 bg-rose-500/60 grayscale transition-colors cursor-default'
)
const loadingFilledStyle = clsx(
    'rounded-md border border-transparent py-2 px-3 text-sm font-semibold outline-none focus-visible:outline-rose-500 selection:focus-visible:outline-rose-500 text-white/60 bg-rose-500/60 transition-colors cursor-default'
)
const defaultOutlineStyle = clsx(
    'rounded-md border py-2 px-3 text-sm font-semibold outline-none focus-visible:outline-rose-500 border-rose-500 text-rose-500 hover:bg-rose-500/10 active:translate-y-[1px] transition-colors'
)
const disabledOutlineStyle = clsx(
    'rounded-md border py-2 px-3 text-sm font-semibold outline-none focus-visible:outline-rose-500 border-rose-500/60 text-rose-500/60 grayscale transition-colors cursor-default'
)
const loadingOutlineStyle = clsx(
    'rounded-md border py-2 px-3 text-sm font-semibold outline-none focus-visible:outline-rose-500 border-rose-500/60 text-rose-500/60 transition-colors cursor-default'
)
const defaultSubtleStyle = clsx(
    'rounded-md border border-transparent py-2 px-3 text-sm font-semibold outline-none focus-visible:outline-rose-500 text-rose-500 hover:bg-rose-500/10 active:translate-y-[1px] transition-colors'
)
const disabledSubtleStyle = clsx(
    'rounded-md border border-transparent py-2 px-3 text-sm font-semibold outline-none focus-visible:outline-rose-500 text-rose-500/60 grayscale transition-colors cursor-default'
)
const loadingSubtleStyle = clsx(
    'rounded-md border border-transparent py-2 px-3 text-sm font-semibold outline-none focus-visible:outline-rose-500 text-rose-500/60 transition-colors cursor-default'
)

const Button = forwardRef<HTMLButtonElement, Props>((props, forwardedRef) => {
    // Fallback ref may need to be used with some aria/radix components
    // const fallbackRef = useRef<HTMLButtonElement>(null)
    // const domRef = forwardedRef || fallbackRef

    // Remove loading from props to prevent error: Received `false` for a non-boolean attribute `loading`.
    const { loading, ...other } = props

    function onClick() {
        // Disable click if loading.
        if (props.loading) {
            return
        }
        if (props.onClick) {
            props.onClick()
        }
    }

    return (
        <button
            {...other}
            ref={forwardedRef}
            type={props.type ?? 'button'}
            className={clsx(
                props.variant === 'filled' &&
                    (props.disabled ? disabledFilledStyle : props.loading ? loadingFilledStyle : defaultFilledStyle),
                props.variant === 'outline' &&
                    (props.disabled ? disabledOutlineStyle : props.loading ? loadingOutlineStyle : defaultOutlineStyle),
                props.variant === 'subtle' &&
                    (props.disabled ? disabledSubtleStyle : props.loading ? loadingSubtleStyle : defaultSubtleStyle),
                props.className
            )}
            disabled={props.disabled}
            onClick={onClick}
        >
            <div className="flex items-center justify-center space-x-2">
                {props.loading ? <Loader2 size={20} className="animate-spin" /> : props.icon}
                {props.text && <span>{props.text}</span>}
            </div>
        </button>
    )
})

export default Button
