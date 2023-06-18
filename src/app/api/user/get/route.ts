import { authOptions } from '@/lib/auth'
import AppDatabase from '@/lib/database'
import { getServerSession } from 'next-auth'

// Get user from database as User type.
export async function GET(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return new Response(null, { status: 401, statusText: 'Unauthorized request.' })
    }

    try {
        const user = await AppDatabase.getUser(session.user.id)
        return new Response(JSON.stringify(user), { status: 200 })
    } catch (error) {
        return new Response(null, { status: 500, statusText: 'There was a connection error.' })
    }
}
