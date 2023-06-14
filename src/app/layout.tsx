'use client'

import './globals.css'
import { Roboto } from 'next/font/google'
import { SessionProvider } from 'next-auth/react'

const font = Roboto({ weight: '400', subsets: ['latin'] })

export const metadata = {
    title: 'Create Next App',
    description: 'Generated by create next app'
}

export default function RootLayout({ children, session }: { children: React.ReactNode; session: any }) {
    return (
        <html lang="en">
            <body className={font.className}>
                <SessionProvider session={session}>{children}</SessionProvider>
            </body>
        </html>
    )
}
