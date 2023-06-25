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

const defaultStyle = clsx(
    'rounded border border-zinc-950/20 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-rose-500 dark:border-white/20 dark:bg-zinc-950'
)
const disabledStyle = clsx(
    'rounded border border-zinc-950/10 bg-white/60 px-3 py-2 text-sm outline-none transition-colors dark:border-white/10 dark:bg-zinc-950/60 grayscale'
)
const errorStyle = clsx('rounded border border-red-500 bg-white px-3 py-2 text-sm outline-none transition-colors dark:bg-zinc-950')

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
                className={clsx(props.disabled ? disabledStyle : props.error ? errorStyle : defaultStyle)}
                disabled={props.disabled}
                value={props.value}
                onChange={(e) => {
                    props.onChange(e.target.value)
                }}
            />
            {props.error && (
                <div className="mt-1 flex items-center space-x-1 text-red-500">
                    <AlertTriangle size={16} />
                    <p className="text-sm italic">{props.error}</p>
                </div>
            )}
        </div>
    )
})

export default InputText
