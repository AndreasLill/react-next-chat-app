import clsx from 'clsx'
import { AlertTriangle } from 'lucide-react'
import { forwardRef } from 'react'

interface Props {
    title: string
    text: string
    className?: string
}

const Alert = forwardRef<HTMLDivElement, Props>((props, forwardedRef) => {
    return (
        <div {...props} ref={forwardedRef} className={clsx('flex flex-col space-y-1 rounded-md bg-error/20 p-4', props.className)}>
            <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 text-error" />
                <h1 className="ms-2 text-sm font-semibold text-error">{props.title}</h1>
            </div>
            <div>
                <p className="ms-6">{props.text}</p>
            </div>
        </div>
    )
})

export default Alert
