import { DefaultSession } from 'next-auth'

type SessionUser = {
    id: string
}

declare module 'next-auth' {
    interface Session extends DefaultSession {
        user?: SessionUser
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string
    }
}
