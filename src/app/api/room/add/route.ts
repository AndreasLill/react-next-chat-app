import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import AppDatabase from '@/lib/database'
import { z as zod } from 'zod'
import { ApiRoomAdd } from '@/types/api'

const validationSchema = zod.object({
    name: zod.string().min(1).max(32)
})

// Add a new room to the database with session user as owner and return the id.
export async function POST(req: Request) {
    const body = (await req.json()) as ApiRoomAdd
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return new Response(null, { status: 401, statusText: 'Unauthorized request.' })
    }

    const result = validationSchema.safeParse({ name: body.name })
    if (!result.success) {
        return new Response(null, { status: 400, statusText: 'Invalid request.' })
    }

    try {
        const id = await AppDatabase.addRoom(session.user.id, body.name)
        return new Response(JSON.stringify(id), { status: 200 })
    } catch (error) {
        return new Response(null, { status: 500, statusText: 'There was a connection error.' })
    }
}
