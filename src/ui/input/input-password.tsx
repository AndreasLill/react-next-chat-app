import { AlertTriangle, Eye, EyeOff } from 'lucide-react'
import { forwardRef, useState } from 'react'
import { clsx } from 'clsx'

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
    default: clsx('flex items-center rounded border bg-background text-sm outline-none transition-all dark:bg-background-dark'),
    disabled: clsx(
        'flex items-center rounded border border-on-surface/10 bg-background/60 text-sm outline-none transition-all dark:border-on-surface-dark/10 dark:bg-background-dark/60 grayscale'
    )
}

const InputPassword = forwardRef<HTMLDivElement, Props>((props, forwardedRef) => {
    const [focus, setFocus] = useState<boolean>(false)
    const [showPassword, setShowPassword] = useState<boolean>(false)

    return (
        <div ref={forwardedRef} className="flex flex-col">
            {props.label && (
                <label htmlFor={props.id} className="pb-1 text-sm">
                    {props.label}
                </label>
            )}
            <div
                className={clsx(
                    props.disabled ? styles.disabled : styles.default,
                    props.error ? 'border-error' : focus ? 'border-primary' : 'border-on-surface/20 dark:border-on-surface-dark/20'
                )}
            >
                <input
                    {...props}
                    id={props.id}
                    name={props.id}
                    type={showPassword ? 'text' : 'password'}
                    placeholder={props.placeholder}
                    className="h-full flex-grow rounded border-0 bg-transparent px-3 py-2 outline-none"
                    disabled={props.disabled}
                    autoComplete="off"
                    value={props.value}
                    onChange={(e) => props.onChange(e.target.value)}
                    onFocus={() => setFocus(true)}
                    onBlur={() => setFocus(false)}
                />
                {showPassword ? (
                    <EyeOff className="h-8 w-8 cursor-pointer rounded-md p-2 hover:bg-primary/10" onClick={() => setShowPassword(false)} />
                ) : (
                    <Eye className="h-8 w-8 cursor-pointer rounded-md p-2 hover:bg-primary/10" onClick={() => setShowPassword(true)} />
                )}
            </div>
            {props.error && (
                <div className="mt-1 flex items-center space-x-1 text-error">
                    <AlertTriangle size={16} />
                    <p className="text-sm italic">{props.error}</p>
                </div>
            )}
        </div>
    )
})

export default InputPassword
