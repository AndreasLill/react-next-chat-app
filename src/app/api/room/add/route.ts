import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import AppDatabase from '@/lib/database'

// Add a new room to the database with session user as owner and return the id.
export async function POST(req: Request) {
    const body = await req.json()
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return new Response(null, { status: 401, statusText: 'Unauthorized request.' })
    }

    if (!body?.name) {
        return new Response(null, { status: 400, statusText: 'Please fill in all required fields.' })
    }

    try {
        const id = await AppDatabase.addRoom(session.user.id, body.name)
        return new Response(JSON.stringify(id), { status: 200 })
    } catch (error) {
        return new Response(null, { status: 500, statusText: 'There was a connection error.' })
    }
}
