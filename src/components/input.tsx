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
                className={`${props.className} px-3 py-2 mt-2 border rounded-md border-on-surface/20 dark:border-on-surface-dark/20 bg-background dark:bg-background-dark text-on-surface dark:text-on-surface-dark focus:outline-none focus:outline-offset-0 focus:outline-primary`}
                value={props.value}
                onChange={(e) => props.onChange(e.target.value)}
            />
        </div>
    )
}
