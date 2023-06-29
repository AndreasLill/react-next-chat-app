import { DefaultSession } from 'next-auth'

type SessionUser = {
    id: string
    name: string
    email: string
}

declare module 'next-auth' {
    interface Session extends DefaultSession {
        user?: SessionUser
    }

    interface User extends SessionUser {}
}

declare module 'next-auth/jwt' {
    interface JWT extends SessionUser {}
}
