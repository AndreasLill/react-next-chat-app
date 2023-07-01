import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import AppDatabase from '@/lib/database'
import { z as zod } from 'zod'
import { ApiRoomJoin } from '@/types/api'

const validationSchema = zod.object({
    room: zod.string().uuid()
})

// Join a room by id with the session user.
export async function POST(req: Request) {
    const body = (await req.json()) as ApiRoomJoin
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return new Response(null, { status: 401, statusText: 'Unauthorized request.' })
    }

    const result = validationSchema.safeParse({ room: body.id })
    if (!result.success) {
        return new Response(null, { status: 400, statusText: 'Invalid request.' })
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
