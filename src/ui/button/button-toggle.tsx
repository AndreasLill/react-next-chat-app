import clsx from 'clsx'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: JSX.Element
    text?: string
    toggled: boolean
}

const ButtonToggle = forwardRef<HTMLButtonElement, Props>(({ icon, text, toggled, className, ...props }, forwardedRef) => {
    return (
        <button
            {...props}
            ref={forwardedRef}
            className={clsx(
                'rounded-e-md border-s-2 outline-none outline-offset-[-2px] transition-colors focus-visible:outline-primary',
                toggled
                    ? 'border-primary bg-primary/20 font-semibold'
                    : 'border-on-surface/20 hover:bg-on-surface/10 dark:border-on-surface-dark/20 dark:hover:bg-on-surface-dark/10',
                className
            )}
        >
            <div className="flex items-center space-x-2 px-6 py-3 text-sm">
                {icon}
                {text && <span>{text}</span>}
            </div>
        </button>
    )
})

export default ButtonToggle
