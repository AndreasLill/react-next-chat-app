import AppDatabase from '@/repository/database'
import { ApiResponse } from '@/types/api'

export async function POST(req: Request) {
    const body = await req.json()
    var res: ApiResponse

    if (!body?.name) {
        res = { status: 'error', error: 'Please fill in all required fields.' }
        return new Response(JSON.stringify(res))
    }

    try {
        const id = await AppDatabase.addRoom(body.name)
        res = { status: 'success', data: id }
    } catch (error) {
        res = { status: 'error', error: 'There was a connection error.' }
    }

    return new Response(JSON.stringify(res))
}
