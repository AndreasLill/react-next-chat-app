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

const styles = {
    filledDefault: clsx(
        'rounded-md border border-transparent py-2 px-3 text-sm font-semibold outline-none focus-visible:outline-primary text-on-primary bg-primary hover:bg-primary/80 active:translate-y-[1px] transition-colors'
    ),
    filledDisabled: clsx(
        'rounded-md border border-transparent py-2 px-3 text-sm font-semibold outline-none focus-visible:outline-primary text-on-primary/60 bg-primary/60 grayscale transition-colors cursor-default'
    ),
    filledLoading: clsx(
        'rounded-md border border-transparent py-2 px-3 text-sm font-semibold outline-none focus-visible:outline-primary selection:focus-visible:outline-primary text-on-primary/60 bg-primary/60 transition-colors cursor-default'
    ),
    outlineDefault: clsx(
        'rounded-md border py-2 px-3 text-sm font-semibold outline-none focus-visible:outline-primary border-primary text-primary hover:bg-primary/10 active:translate-y-[1px] transition-colors'
    ),
    outlineDisabled: clsx(
        'rounded-md border py-2 px-3 text-sm font-semibold outline-none focus-visible:outline-primary border-primary/60 text-primary/60 grayscale transition-colors cursor-default'
    ),
    outlineLoading: clsx(
        'rounded-md border py-2 px-3 text-sm font-semibold outline-none focus-visible:outline-primary border-primary/60 text-primary/60 transition-colors cursor-default'
    ),
    subtleDefault: clsx(
        'rounded-md border border-transparent py-2 px-3 text-sm font-semibold outline-none focus-visible:outline-primary text-primary hover:bg-primary/10 active:translate-y-[1px] transition-colors'
    ),
    subtleDisabled: clsx(
        'rounded-md border border-transparent py-2 px-3 text-sm font-semibold outline-none focus-visible:outline-primary text-primary/60 grayscale transition-colors cursor-default'
    ),
    subtleLoading: clsx(
        'rounded-md border border-transparent py-2 px-3 text-sm font-semibold outline-none focus-visible:outline-primary text-primary/60 transition-colors cursor-default'
    )
}

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
                    (props.disabled ? styles.filledDisabled : props.loading ? styles.filledLoading : styles.filledDefault),
                props.variant === 'outline' &&
                    (props.disabled ? styles.outlineDisabled : props.loading ? styles.outlineLoading : styles.outlineDefault),
                props.variant === 'subtle' &&
                    (props.disabled ? styles.subtleDisabled : props.loading ? styles.subtleLoading : styles.subtleDefault),
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
