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
        'rounded-md border border-transparent text-sm font-semibold outline-none focus-visible:outline-primary text-on-primary bg-primary hover:bg-primary/80 active:translate-y-[1px] transition-colors'
    ),
    filledLoading: clsx(
        'rounded-md border border-transparent text-sm font-semibold outline-none focus-visible:outline-primary text-on-primary/50 bg-primary/50 transition-colors cursor-default'
    ),
    outlineDefault: clsx(
        'rounded-md border text-sm font-semibold outline-none focus-visible:outline-primary border-primary text-primary hover:bg-primary/10 active:translate-y-[1px] transition-colors'
    ),
    outlineLoading: clsx(
        'rounded-md border text-sm font-semibold outline-none focus-visible:outline-primary border-primary/50 text-primary/50 transition-colors cursor-default'
    ),
    subtleDefault: clsx(
        'rounded-md border border-transparent text-sm font-semibold outline-none focus-visible:outline-primary text-primary hover:bg-primary/10 active:translate-y-[1px] transition-colors'
    ),
    subtleLoading: clsx(
        'rounded-md border border-transparent text-sm font-semibold outline-none focus-visible:outline-primary text-primary/50 transition-colors cursor-default'
    ),
    disabled: clsx(
        'rounded-md border border-transparent text-sm font-semibold outline-none text-on-surface/50 bg-surface/50 transition-colors'
    )
}

const Button = forwardRef<HTMLButtonElement, Props>((props, forwardedRef) => {
    // Fallback ref may need to be used with some aria/radix components
    // const fallbackRef = useRef<HTMLButtonElement>(null)
    // const domRef = forwardedRef || fallbackRef

    // Remove loading from props to prevent error: Received `false` for a non-boolean attribute `loading`.
    const { loading, ...other } = props

    return (
        <button
            {...other}
            ref={forwardedRef}
            type={props.type ?? 'button'}
            className={clsx(
                props.variant === 'filled' &&
                    (props.disabled ? styles.disabled : props.loading ? styles.filledLoading : styles.filledDefault),
                props.variant === 'outline' &&
                    (props.disabled ? styles.disabled : props.loading ? styles.outlineLoading : styles.outlineDefault),
                props.variant === 'subtle' &&
                    (props.disabled ? styles.disabled : props.loading ? styles.subtleLoading : styles.subtleDefault),
                props.text ? 'px-3 py-2' : 'p-2',
                props.className
            )}
            disabled={props.disabled}
            onClick={props.loading ? () => {} : props.onClick}
        >
            <div className="flex items-center justify-center space-x-2">
                {props.loading ? <Loader2 size={20} className="animate-spin" /> : props.icon}
                {props.text && <span>{props.text}</span>}
            </div>
        </button>
    )
})

export default Button
