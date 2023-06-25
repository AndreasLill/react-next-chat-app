import clsx from 'clsx'
import { AlertCircle } from 'lucide-react'
import { forwardRef } from 'react'

interface Props {
    title: string
    text: string
    className?: string
}

const Alert = forwardRef<HTMLDivElement, Props>((props, forwardedRef) => {
    return (
        <div {...props} ref={forwardedRef} className={clsx('flex flex-col space-y-1 rounded-md bg-red-500/20 p-4', props.className)}>
            <div className="flex items-center">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <h1 className="ms-2 text-sm font-semibold text-red-500">{props.title}</h1>
            </div>
            <div>
                <p className="ms-6 text-sm">{props.text}</p>
            </div>
        </div>
    )
})

export default Alert
