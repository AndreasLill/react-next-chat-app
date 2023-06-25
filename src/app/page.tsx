'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import LoginForm from './forms/loginform'
import RegistrationForm from './forms/registrationform'
import Chat from './chat/chat'

enum AuthTabs {
    Login,
    Registration
}

export default function Home() {
    const { data: session, status } = useSession()
    const [authTab, setAuthTab] = useState<AuthTabs>(AuthTabs.Login)

    // Authenticated and logged in.
    if (session?.user) {
        return <Chat />
    }

    // Authentication loading.
    if (status === 'loading') {
        return (
            <div className="flex h-screen w-screen items-center justify-center">
                <Loader2 className="animate-spin text-rose-500" size={64} />
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
