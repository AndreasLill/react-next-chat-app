import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import AppDatabase from '@/lib/database'

// Join a room by id with the session user.
export async function POST(req: Request) {
    const body = await req.json()
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return new Response(null, { status: 401, statusText: 'Unauthorized request.' })
    }

    if (!body?.id) {
        return new Response(null, { status: 400, statusText: 'No room ID was supplied.' })
    }

    try {
        const results = await AppDatabase.joinRoom(session.user.id, body.id)

        if (results.ErrorCode == 547) {
            return new Response(null, { status: 400, statusText: `A room with ID '${body.id}' does not exist.` })
        }
        if (results.ErrorCode == 2627) {
            return new Response(null, { status: 400, statusText: 'You have already joined this room.' })
        }

        return new Response(null, { status: 200 })
    } catch (error) {
        return new Response(null, { status: 500, statusText: 'There was a connection error.' })
    }
}
