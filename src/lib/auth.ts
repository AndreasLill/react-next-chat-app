import CredentialsProvider from 'next-auth/providers/credentials'
import { NextAuthOptions } from 'next-auth'
import AppDatabase from '@/repository/database'

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials, req) {
                if (!credentials?.username || !credentials?.password) {
                    console.log('Email or password was empty.')
                    return null
                }

                // Username is email for login credentials.
                return AppDatabase.authenticateUser(credentials.username, credentials.password)
            }
        })
    ],
    session: {
        strategy: 'jwt'
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
            }
            return token
        },
        session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id
            }
            return session
        }
    }
}
