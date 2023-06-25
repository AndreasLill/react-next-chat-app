import { forwardRef } from 'react'
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

const defaultStyle = clsx(
    'rounded border border-zinc-950/20 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-rose-500 disabled:grayscale dark:border-white/20 dark:bg-zinc-950'
)
const disabledStyle = clsx(
    'rounded border border-zinc-950/10 bg-white/60 px-3 py-2 text-sm outline-none transition-colors dark:border-white/10 dark:bg-zinc-950/60 grayscale'
)

const InputText = forwardRef<HTMLDivElement, Props>((props, forwardedRef) => {
    return (
        <div ref={forwardedRef} className="flex flex-col">
            {props.label && (
                <label htmlFor={props.id} className="mb-1 text-sm">
                    {props.label}
                </label>
            )}
            <input
                {...props}
                id={props.id}
                type="text"
                placeholder={props.placeholder}
                className={props.disabled ? clsx(disabledStyle) : clsx(defaultStyle)}
                disabled={props.disabled}
                value={props.value}
                onChange={(e) => props.onChange(e.target.value)}
            />
        </div>
    )
})

export default InputText
