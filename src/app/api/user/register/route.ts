import AppDatabase from '@/repository/database'
import { ApiResponse } from '@/types/api'

export async function POST(req: Request) {
    const body = await req.json()
    var res: ApiResponse

    // Check if user information is null.
    if (!body?.username || !body?.email || !body?.password) {
        res = { status: 'error', code: 400, error: 'info-missing' }
        return new Response(JSON.stringify(res))
    }

    // Check if email is taken.
    try {
        if (await AppDatabase.existsUser(body.email)) {
            console.log(`Email '${body.email}' already exists.`)
            res = { status: 'error', code: 400, error: 'email-taken' }
            return new Response(JSON.stringify(res))
        }
    } catch (error) {
        console.error(error)
        res = { status: 'error', code: 400, error: 'db-error' }
    }

    // Add user to database.
    try {
        await AppDatabase.addUser(body.username, body.password, body.email)
        console.log(`Added user '${body.username}' to database.`)
        res = { status: 'success', code: 200 }
    } catch (error) {
        console.error(error)
        res = { status: 'error', code: 400, error: 'db-error' }
    }

    return new Response(JSON.stringify(res))
}
