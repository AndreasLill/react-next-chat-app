import { Message } from '@/types/message'
import { formatDate } from '@/utils/time'
import clsx from 'clsx'

interface Props {
    messages: Message[]
    disabled: boolean
}

export default function ChatScreen(props: Props) {
    return (
        <div
            className={clsx(
                'mx-6 flex flex-grow flex-col overflow-y-scroll rounded border border-on-surface/20 bg-background dark:border-on-surface-dark/20 dark:bg-background-dark',
                props.disabled && 'opacity-50 grayscale'
            )}
        >
            {props.messages?.map((message) => (
                <div key={message.id} className="flex flex-col px-6 py-3 hover:bg-primary/10">
                    {message.user && (
                        <div>
                            <span className="text-md font-semibold">{message.user}</span>
                            <span className="mx-2 text-sm text-on-surface/50 dark:text-on-surface-dark/50">
                                {formatDate(navigator.language, message.sent)}
                            </span>
                        </div>
                    )}
                    {message.user ? (
                        <span className="break-all">{message.text}</span>
                    ) : (
                        <span className="break-all text-sm font-semibold italic">{message.text}</span>
                    )}
                </div>
            ))}
        </div>
    )
}
