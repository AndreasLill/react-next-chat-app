import { forwardRef } from 'react'
import { clsx } from 'clsx'
import { AlertTriangle } from 'lucide-react'

interface Props {
    id: string
    label?: string
    placeholder?: string
    className?: string
    disabled?: boolean
    error?: string
    value?: string
    onChange: (value: string) => void
}

const styles = {
    default: clsx(
        'rounded border border-on-surface/20 bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary dark:border-on-surface-dark/20 dark:bg-background-dark'
    ),
    disabled: clsx(
        'rounded border border-on-surface/10 bg-background/60 px-3 py-2 text-sm outline-none transition-colors dark:border-on-surface-dark/10 dark:bg-background-dark/60 grayscale'
    ),
    error: clsx('rounded border border-error bg-background px-3 py-2 text-sm outline-none transition-colors dark:bg-background-dark')
}

const InputText = forwardRef<HTMLDivElement, Props>((props, forwardedRef) => {
    return (
        <div ref={forwardedRef} className="flex flex-col">
            {props.label && (
                <label htmlFor={props.id} className="pb-1 text-sm">
                    {props.label}
                </label>
            )}
            <input
                {...props}
                id={props.id}
                name={props.id}
                type="text"
                placeholder={props.placeholder}
                className={clsx(props.disabled ? styles.disabled : props.error ? styles.error : styles.default)}
                disabled={props.disabled}
                value={props.value}
                onChange={(e) => {
                    props.onChange(e.target.value)
                }}
            />
            {props.error && (
                <div className="mt-1 flex items-center space-x-1 text-error">
                    <AlertTriangle size={16} />
                    <p className="text-sm italic">{props.error}</p>
                </div>
            )}
        </div>
    )
})

export default InputText
