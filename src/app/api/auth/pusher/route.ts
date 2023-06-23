import { authOptions } from '@/lib/auth'
import AppDatabase from '@/lib/database'
import { channelPrefix, pusherServer } from '@/lib/pusher'
import { getServerSession } from 'next-auth'
import Pusher from 'pusher'

export async function POST(req: Request) {
    const body = await req.formData()
    const socket = body.get('socket_id') as string
    const channel = body.get('channel_name') as string

    const session = await getServerSession(authOptions)
    if (!session?.user) {
        return new Response(null, { status: 403 })
    }

    try {
        const authorized = AppDatabase.authorizeUserRoom(session.user.id, channel.replace(channelPrefix, ''))
        if (!authorized) {
            return new Response(null, { status: 403 })
        }
    } catch (error) {
        return new Response(null, { status: 403 })
    }

    const userData = {
        user_id: session?.user.id
    } as Pusher.PresenceChannelData

    console.log(`Authorized user ${session.user.id} for room ${channel.replace(channelPrefix, '')}.`)
    const response = pusherServer.authorizeChannel(socket, channel, userData)
    return new Response(JSON.stringify(response), { status: 200 })
}
