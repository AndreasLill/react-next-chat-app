import { AlertTriangle } from 'lucide-react'
import * as Popover from '@radix-ui/react-popover'
import { Dispatch, SetStateAction } from 'react'

interface Props {
    id: string
    type: 'text' | 'password'
    label?: string
    error?: string
    setError?: Dispatch<SetStateAction<string>>
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
            <Popover.Root open={true}>
                <Popover.Anchor>
                    <input
                        id={props.id}
                        type={props.type}
                        placeholder={props.placeholder}
                        className={`${props.className} ${
                            props.error ? 'border-red-500 dark:text-red-400' : 'border-black/20 dark:border-white/20'
                        } ${
                            !props.disabled ? 'bg-slate-100 dark:bg-zinc-950' : 'bg-slate-100/50 dark:bg-zinc-950/50'
                        } px-3 py-2 border rounded-md text-black dark:text-white focus:outline-none focus:outline-offset-0 focus:outline-rose-500 disabled:cursor-not-allowed`}
                        disabled={props.disabled ?? false}
                        autoComplete={props.autocomplete}
                        value={props.value}
                        onChange={(e) => {
                            if (props.setError) {
                                props.setError('')
                            }
                            props.onChange(e.target.value)
                        }}
                    />
                </Popover.Anchor>
                <Popover.Portal>
                    <Popover.Content
                        side="top"
                        sideOffset={6}
                        className={`bg-red-500/90 border-0 rounded-lg transition-opacity duration-300 z-50 ${
                            props.error ? 'opacity-100' : 'opacity-0'
                        }`}
                        onInteractOutside={() => {
                            if (props.setError) {
                                props.setError('')
                            }
                        }}
                    >
                        {props.error && (
                            <div className="flex items-center space-x-2 p-3">
                                <AlertTriangle size={18} />
                                <p className="text-sm text-white">{props.error}</p>
                                <Popover.Arrow className="fill-red-500/90" />
                            </div>
                        )}
                    </Popover.Content>
                </Popover.Portal>
            </Popover.Root>
        </div>
    )
}
