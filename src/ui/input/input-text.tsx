import { InputHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'
import { AlertTriangle } from 'lucide-react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
}

const styles = {
    default: clsx(
        'rounded border border-on-surface/20 bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary dark:border-on-surface-dark/20 dark:bg-background-dark'
    ),
    error: clsx('rounded border border-error bg-background px-3 py-2 text-sm outline-none transition-colors dark:bg-background-dark')
}

const InputText = forwardRef<HTMLDivElement, Props>(({ label, error, ...props }, forwardedRef) => {
    return (
        <div ref={forwardedRef} className="flex flex-col">
            {label && (
                <label htmlFor={props.id} className="pb-1 text-sm">
                    {label}
                </label>
            )}
            <input
                {...props}
                type="text"
                className={clsx(error ? styles.error : styles.default, props.disabled && 'opacity-50 grayscale', props.className)}
            />
            {error && (
                <div className="mt-1 flex items-center space-x-1 text-error">
                    <AlertTriangle size={16} />
                    <p className="text-sm italic">{error}</p>
                </div>
            )}
        </div>
    )
})

export default InputText
