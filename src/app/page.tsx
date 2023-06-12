'use client'

import { useSession } from 'next-auth/react'
import LoginForm from './components/loginform'
import UserInfo from './components/userinfo'
import { useState } from 'react'
import RegistrationForm from './components/registrationform'

enum AuthTabs {
    Login,
    Registration
}

export default function Home() {
    const { data: session, status } = useSession()
    const [authTab, setAuthTab] = useState<AuthTabs>(AuthTabs.Login)

    // Authenticated and logged in.
    if (session?.user) {
        return (
            <div className="flex flex-col items-center mx-auto max-w-5xl px-8 py-24">
                <UserInfo />
            </div>
        )
    }

    // Authentication loading.
    if (status === 'loading') {
        return (
            <div className="flex flex-col items-center mx-auto max-w-5xl px-8 py-24">
                <h1 className="block mb-4 text-center dark:text-white font-bold text-2xl">Loading...</h1>
            </div>
        )
    }

    // Authentication.
    if (authTab == AuthTabs.Login) {
        return <LoginForm onChangeToRegistration={() => setAuthTab(AuthTabs.Registration)} />
    }
    if (authTab == AuthTabs.Registration) {
        return <RegistrationForm onChangeToLogin={() => setAuthTab(AuthTabs.Login)} />
    }
}
