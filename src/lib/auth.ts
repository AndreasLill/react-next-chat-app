import CredentialsProvider from "next-auth/providers/credentials"
import { NextAuthOptions, User } from "next-auth"

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                // Used to testing purposes only, will change to API call.
                if (credentials?.username === "AndreasLill" && credentials?.password == "pass") {
                    return { id: "1", name: "AndreasLill", email: "andreas@email.com" } as User
                }
                else {
                    return null
                }
            },
        })
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.name = user.name
                token.email = user.email
            }
            return token
        },
        session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id
                session.user.name = token.name
                session.user.email = token.email
            }
            return session
        }
    },
}