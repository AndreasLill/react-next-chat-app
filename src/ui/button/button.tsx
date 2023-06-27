import clsx from 'clsx'
import { Loader2 } from 'lucide-react'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant: 'filled' | 'outline' | 'subtle'
    icon?: JSX.Element
    text?: string
    loading?: boolean
}

const styles = {
    filledDefault: clsx(
        'rounded-md border border-transparent text-sm font-semibold outline-none focus-visible:outline-primary text-on-primary bg-primary hover:bg-primary/80 active:translate-y-[1px] transition-colors'
    ),
    outlineDefault: clsx(
        'rounded-md border text-sm font-semibold outline-none focus-visible:outline-primary border-primary text-primary hover:bg-primary/10 active:translate-y-[1px] transition-colors'
    ),
    subtleDefault: clsx(
        'rounded-md border border-transparent text-sm font-semibold outline-none focus-visible:outline-primary text-primary hover:bg-primary/10 active:translate-y-[1px] transition-colors'
    ),
    disabled: clsx(
        'rounded-md border border-transparent text-sm font-semibold outline-none text-on-surface/50 bg-surface/50 transition-colors'
    )
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
                variant === 'filled' && (props.disabled ? styles.disabled : styles.filledDefault),
                variant === 'outline' && (props.disabled ? styles.disabled : styles.outlineDefault),
                variant === 'subtle' && (props.disabled ? styles.disabled : styles.subtleDefault),
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
