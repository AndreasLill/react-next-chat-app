interface Props {
    id: string
    type: 'text' | 'password'
    label?: string
    placeholder?: string
    className?: string
    value: string
    onChange: (value: string) => void
}

export default function Input(props: Props) {
    return (
        <div>
            {props.label && (
                <label htmlFor={props.id} className="block text-sm">
                    {props.label}
                </label>
            )}
            <input
                id={props.id}
                type={props.type}
                placeholder={props.placeholder}
                className={`${props.className} px-3 py-2 mt-2 border rounded-md border-black/20 dark:border-white/20 bg-slate-100 dark:bg-zinc-950 text-black dark:text-white focus:outline-none focus:outline-offset-0 focus:outline-rose-500`}
                value={props.value}
                onChange={(e) => props.onChange(e.target.value)}
            />
        </div>
    )
}
