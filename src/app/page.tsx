'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import LoginForm from './components/loginform'
import RegistrationForm from './components/registrationform'
import UserInfo from './components/userinfo'

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
            <div className="flex items-center justify-center w-screen h-screen">
                <Loader2 className="text-emerald-700 animate-spin" size={64} />
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
