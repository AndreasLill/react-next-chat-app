import { AlertTriangle, Eye, EyeOff } from 'lucide-react'
import { InputHTMLAttributes, forwardRef, useState } from 'react'
import { clsx } from 'clsx'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
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
                    'flex items-center rounded border bg-background text-sm outline-none transition-all dark:bg-background-dark',
                    props.disabled && 'opacity-50 grayscale',
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
                    <EyeOff
                        className={clsx('h-8 w-8 rounded-md p-2', !props.disabled && 'cursor-pointer hover:bg-primary/10')}
                        onClick={() => (props.disabled ? () => {} : setShowPassword(false))}
                    />
                ) : (
                    <Eye
                        className={clsx('h-8 w-8 rounded-md p-2', !props.disabled && 'cursor-pointer hover:bg-primary/10')}
                        onClick={() => (props.disabled ? () => {} : setShowPassword(true))}
                    />
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
