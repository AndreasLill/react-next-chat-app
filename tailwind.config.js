/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/pages/**/*.{js,ts,jsx,tsx,mdx}', './src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}'],
    theme: {
        extend: {
            colors: {
                primary: '#f43f5e',
                'on-primary': '#ffffff',

                background: '#f1f5f9',
                surface: '#ffffff',
                'on-surface': '#000000',
                error: '#ef4444',

                'background-dark': '#09090b',
                'surface-dark': '#18181b',
                'on-surface-dark': '#ffffff',
                'error-dark': '#ef4444'
            }
        }
    },
    plugins: [require('tailwindcss-radix')()]
}
