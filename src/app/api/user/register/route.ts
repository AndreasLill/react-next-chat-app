import AppDatabase from '@/repository/database'
import { ApiResponse } from '@/types/api'

export async function POST(req: Request) {
    const body = await req.json()
    var res: ApiResponse

    // Check if user information is null.
    if (!body?.name || !body?.email || !body?.password) {
        res = { status: 'error', code: 400, error: 'Please fill in all required fields.' }
        return new Response(JSON.stringify(res))
    }

    // Check if email is taken.
    try {
        if (await AppDatabase.existsUser(body.email)) {
            console.log(`Email '${body.email}' already exists.`)
            res = { status: 'error', code: 400, error: 'This email is already taken.' }
            return new Response(JSON.stringify(res))
        }
    } catch (error) {
        res = { status: 'error', code: 400, error: 'There was a connection error.' }
    }

    // Add user to database.
    try {
        await AppDatabase.addUser(body.name, body.email, body.password)
        console.log(`Added user '${body.email}' to database.`)
        res = { status: 'success', code: 200 }
    } catch (error) {
        res = { status: 'error', code: 400, error: 'There was a connection error.' }
    }

    return new Response(JSON.stringify(res))
}
