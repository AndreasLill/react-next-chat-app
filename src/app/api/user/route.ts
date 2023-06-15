import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import AppDatabase from '@/lib/database'

// POST Request to add a new user.
export async function POST(req: Request) {
    const body = await req.json()

    // Check if user information is null.
    if (!body?.name || !body?.email || !body?.password) {
        return new Response(null, { status: 400, statusText: 'Please fill in all required fields.' })
    }

    // Check if email is taken.
    try {
        if (await AppDatabase.existsUser(body.email)) {
            return new Response(null, { status: 400, statusText: 'This email is already taken.' })
        }
    } catch (error) {
        return new Response(null, { status: 500, statusText: 'There was a connection error.' })
    }

    // Add user to database.
    try {
        await AppDatabase.addUser(body.name, body.email, body.password)
        return new Response(null, { status: 200 })
    } catch (error) {
        return new Response(null, { status: 500, statusText: 'There was a connection error.' })
    }
}

// POST Request to get user.
export async function GET(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return new Response(null, { status: 401, statusText: 'Unauthorized request.' })
    }

    try {
        const user = await AppDatabase.getUser(session.user.id)
        return new Response(JSON.stringify(user), { status: 200 })
    } catch (error) {
        return new Response(null, { status: 500, statusText: 'There was a connection error.' })
    }
}
