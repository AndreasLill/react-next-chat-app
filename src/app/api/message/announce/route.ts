import { authOptions } from '@/lib/auth'
import { pusherServer } from '@/lib/pusher'
import { ApiMessageAnnounce } from '@/types/api'
import { Message } from '@/types/message'
import { getServerSession } from 'next-auth'

export async function POST(req: Request) {
    const body = (await req.json()) as ApiMessageAnnounce
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return new Response(null, { status: 401, statusText: 'Unauthorized request.' })
    }

    if (!body?.channel) {
        return new Response(null, { status: 400, statusText: 'Invalid request.' })
    }

    switch (body.type) {
        case 'join': {
            const logId = crypto.randomUUID().toUpperCase()
            await pusherServer.trigger(body.channel, 'message', {
                id: `log-${logId}`,
                sent: '',
                text: `${session.user.name} has joined the room.`
            } as Message)
            return new Response(null, { status: 200 })
        }
        default: {
            return new Response(null, { status: 400, statusText: 'Invalid request.' })
        }
    }
}
