import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import AppDatabase from '@/lib/database'
import { ApiMessageSend } from '@/types/api'
import { channelPrefix, pusherServer } from '@/lib/pusher'
import { z as zod } from 'zod'

const validationSchema = zod.object({
    room: zod.string().uuid(),
    message: zod.string().min(1).max(255)
})

export async function POST(req: Request) {
    const body = (await req.json()) as ApiMessageSend
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return new Response(null, { status: 401, statusText: 'Unauthorized request.' })
    }

    const result = validationSchema.safeParse({ room: body.room, message: body.text })
    if (!result.success) {
        return new Response(null, { status: 400, statusText: 'Invalid request.' })
    }

    try {
        const message = await AppDatabase.sendMessage(session.user.id, body.room, body.text)
        await pusherServer.trigger(`${channelPrefix}${body.room}`, 'message', message)
        return new Response(null, { status: 200 })
    } catch (error) {
        return new Response(null, { status: 500, statusText: 'There was a connection error.' })
    }
}
