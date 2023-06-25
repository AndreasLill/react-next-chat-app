import { Eye, EyeOff } from 'lucide-react'
import { forwardRef, useState } from 'react'
import { clsx } from 'clsx'

interface Props {
    id: string
    label?: string
    placeholder?: string
    className?: string
    disabled?: boolean
    value: string
    onChange: (value: string) => void
}

const defaultStyle = clsx('flex items-center rounded border bg-white text-sm outline-none transition-colors dark:bg-zinc-950')
const disabledStyle = clsx(
    'flex items-center rounded border border-zinc-950/10 bg-white/60 text-sm outline-none transition-colors dark:border-white/10 dark:bg-zinc-950/60 grayscale'
)

const InputPassword = forwardRef<HTMLDivElement, Props>((props, forwardedRef) => {
    const [focus, setFocus] = useState<boolean>(false)
    const [showPassword, setShowPassword] = useState<boolean>(false)

    return (
        <div ref={forwardedRef} className="flex flex-col">
            {props.label && (
                <label htmlFor={props.id} className="mb-1 text-sm">
                    {props.label}
                </label>
            )}
            <div
                className={
                    props.disabled
                        ? clsx(disabledStyle)
                        : clsx(defaultStyle, focus ? 'border-rose-500' : 'border-zinc-950/20 dark:border-white/20')
                }
            >
                <input
                    {...props}
                    id={props.id}
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
                    <EyeOff className="h-8 w-8 cursor-pointer rounded-md p-2 hover:bg-rose-500/10" onClick={() => setShowPassword(false)} />
                ) : (
                    <Eye className="h-8 w-8 cursor-pointer rounded-md p-2 hover:bg-rose-500/10" onClick={() => setShowPassword(true)} />
                )}
            </div>
        </div>
    )
})

export default InputPassword
