import clsx from 'clsx'
import { Loader2 } from 'lucide-react'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant: 'filled' | 'outline' | 'subtle' | 'action'
    icon?: JSX.Element
    text?: string
    loading?: boolean
}

const styles = {
    filled: {
        default: clsx(
            'rounded-md border border-transparent text-sm font-semibold outline-none focus-visible:outline-primary text-on-primary bg-primary transition-colors hover:bg-primary/80 active:translate-y-[1px]'
        ),
        disabled: clsx(
            'rounded-md border border-transparent text-sm font-semibold outline-none focus-visible:outline-primary text-on-primary bg-primary transition-colors opacity-50 grayscale'
        )
    },
    outline: {
        default: clsx(
            'rounded-md border text-sm font-semibold outline-none focus-visible:outline-primary border-primary text-primary transition-colors hover:bg-primary/10 active:translate-y-[1px]'
        ),
        disabled: clsx(
            'rounded-md border text-sm font-semibold outline-none focus-visible:outline-primary border-primary text-primary transition-colors opacity-50 grayscale'
        )
    },
    subtle: {
        default: clsx(
            'rounded-md border border-transparent text-sm font-semibold outline-none focus-visible:outline-primary text-primary transition-colors hover:bg-primary/10 active:translate-y-[1px'
        ),
        disabled: clsx(
            'rounded-md border border-transparent text-sm font-semibold outline-none focus-visible:outline-primary text-primary transition-colors opacity-50 grayscale'
        )
    },
    action: {
        default: clsx(
            'rounded-md border border-transparent text-sm font-semibold outline-none focus-visible:outline-primary text-on-surface dark:text-on-surface-dark transition-colors hover:bg-on-surface/10 active:translate-y-[1px] dark:hover:bg-on-surface-dark/10'
        ),
        disabled: clsx(
            'rounded-md border border-transparent text-sm font-semibold outline-none focus-visible:outline-primary text-on-surface dark:text-on-surface-dark transition-colors opacity-50 grayscale'
        )
    }
}

const Button = forwardRef<HTMLButtonElement, Props>(({ variant, icon, text, loading, className, onClick, ...props }, forwardedRef) => {
    // Fallback ref may need to be used with some aria/radix components
    // const fallbackRef = useRef<HTMLButtonElement>(null)
    // const domRef = forwardedRef || fallbackRef

    return (
        <button
            {...props}
            ref={forwardedRef}
            className={clsx(
                variant === 'filled' && (props.disabled ? styles.filled.disabled : styles.filled.default),
                variant === 'outline' && (props.disabled ? styles.outline.disabled : styles.outline.default),
                variant === 'subtle' && (props.disabled ? styles.subtle.disabled : styles.subtle.default),
                variant === 'action' && (props.disabled ? styles.action.disabled : styles.action.default),
                loading && 'cursor-default opacity-50',
                text ? 'px-3 py-2' : 'p-2',
                className
            )}
            onClick={loading ? () => {} : onClick}
        >
            <div className="flex items-center justify-center space-x-2">
                {loading ? <Loader2 size={20} className="animate-spin" /> : icon}
                {text && <span>{text}</span>}
            </div>
        </button>
    )
})

export default Button
