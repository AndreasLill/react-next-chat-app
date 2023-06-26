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
            }
        }
    },
    plugins: [require('tailwindcss-radix')()]
}
