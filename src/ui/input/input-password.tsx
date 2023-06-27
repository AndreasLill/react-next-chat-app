import { AlertTriangle, Eye, EyeOff } from 'lucide-react'
import { InputHTMLAttributes, forwardRef, useState } from 'react'
import { clsx } from 'clsx'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
}

const styles = {
    default: clsx('flex items-center rounded border bg-background text-sm outline-none transition-all dark:bg-background-dark'),
    disabled: clsx(
        'flex items-center rounded border border-on-surface/10 bg-background/50 text-sm outline-none transition-all dark:border-on-surface-dark/10 dark:bg-background-dark/50'
    )
}

const InputPassword = forwardRef<HTMLDivElement, Props>(({ label, error, ...props }, forwardedRef) => {
    const [focus, setFocus] = useState<boolean>(false)
    const [showPassword, setShowPassword] = useState<boolean>(false)

    return (
        <div ref={forwardedRef} className="flex flex-col">
            {label && (
                <label htmlFor={props.id} className="pb-1 text-sm">
                    {label}
                </label>
            )}
            <div
                className={clsx(
                    props.disabled ? styles.disabled : styles.default,
                    error ? 'border-error' : focus ? 'border-primary' : 'border-on-surface/20 dark:border-on-surface-dark/20'
                )}
            >
                <input
                    {...props}
                    type={showPassword ? 'text' : 'password'}
                    className={clsx('h-full flex-grow rounded border-0 bg-transparent px-3 py-2 outline-none', props.className)}
                    autoComplete="off"
                    onFocus={() => setFocus(true)}
                    onBlur={() => setFocus(false)}
                />
                {showPassword ? (
                    <EyeOff className="h-8 w-8 cursor-pointer rounded-md p-2 hover:bg-primary/10" onClick={() => setShowPassword(false)} />
                ) : (
                    <Eye className="h-8 w-8 cursor-pointer rounded-md p-2 hover:bg-primary/10" onClick={() => setShowPassword(true)} />
                )}
            </div>
            {error && (
                <div className="mt-1 flex items-center space-x-1 text-error">
                    <AlertTriangle size={16} />
                    <p className="text-sm italic">{error}</p>
                </div>
            )}
        </div>
    )
})

export default InputPassword
