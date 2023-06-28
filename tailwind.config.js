/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
        './src/ui/**/*.{js,ts,jsx,tsx,mdx}'
    ],
    theme: {
        extend: {
            colors: {
                primary: '#f43f5e',
                error: '#ef4444',

                // Light
                background: '#f1f5f9',
                surface: '#ffffff',
                'on-surface': '#000000',
                'on-primary': '#ffffff',

                // Dark
                'background-dark': '#09090b',
                'surface-dark': '#18181b',
                'on-surface-dark': '#ffffff',
                'on-primary-dark': '#ffffff'
            },
            keyframes: {
                opacity: {
                    from: { opacity: 0 },
                    to: { opacity: 1 }
                },
                'opacity-scale': {
                    from: { opacity: 0, transform: 'translate(-50%, -50%) scale(0.95)' },
                    to: { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' }
                }
            },
            animation: {
                opacity: 'opacity 150ms cubic-bezier(0.16, 1, 0.3, 1)',
                'opacity-scale': 'opacity-scale 150ms cubic-bezier(0.16, 1, 0.3, 1)'
            }
        }
    },
    plugins: [require('tailwindcss-radix')()]
}
