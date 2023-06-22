import { AlertTriangle } from 'lucide-react'

interface Props {
    id: string
    type: 'text' | 'password'
    label?: string
    error?: string
    placeholder?: string
    disabled?: boolean
    autocomplete?: 'on' | 'off'
    className?: string
    value: string
    onChange: (value: string) => void
}

export default function Input(props: Props) {
    return (
        <div>
            {props.label && (
                <label htmlFor={props.id} className="block mb-2 text-sm">
                    {props.label}
                </label>
            )}
            <input
                id={props.id}
                type={props.type}
                placeholder={props.placeholder}
                className={`${props.className} ${
                    props.error ? 'border-red-500 dark:text-red-400' : 'border-black/20 dark:border-white/20'
                } px-3 py-2 border rounded-md bg-slate-100 dark:bg-zinc-950 text-black dark:text-white focus:outline-none focus:outline-offset-0 focus:outline-rose-500 disabled:cursor-not-allowed`}
                disabled={props.disabled ?? false}
                autoComplete={props.autocomplete}
                value={props.value}
                onChange={(e) => props.onChange(e.target.value)}
            />
            {props.error && (
                <div className="flex items-center mt-2 mx-2 space-x-1 text-sm italic text-red-500 dark:text-red-400">
                    <AlertTriangle size={18} />
                    <span>{props.error}</span>
                </div>
            )}
        </div>
    )
}
