import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import AppDatabase from '@/lib/database'
import { ApiBodyMessageSend } from '@/types/api'
import Pusher from 'pusher'

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.NEXT_PUBLIC_PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER
} as Pusher.Options)

export async function POST(req: Request) {
    const body = (await req.json()) as ApiBodyMessageSend
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return new Response(null, { status: 401, statusText: 'Unauthorized request.' })
    }

    if (!body.text) {
        return new Response(null, { status: 400, statusText: 'Cannot send an empty message.' })
    }

    if (!body.room) {
        return new Response(null, { status: 400, statusText: 'Could not find the room.' })
    }

    try {
        const message = await AppDatabase.sendMessage(session.user.id, body.room, body.text)
        await pusher.trigger(body.room, 'message', message)
        return new Response(null, { status: 200 })
    } catch (error) {
        return new Response(null, { status: 500, statusText: 'There was a connection error.' })
    }
}
