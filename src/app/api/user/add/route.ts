import AppDatabase from '@/lib/database'
import { ApiUserAdd } from '@/types/api'
import { z as zod } from 'zod'

const validationSchema = zod.object({
    name: zod.string().min(1).max(32),
    email: zod.string().email().max(255),
    password: zod.string().min(8)
})

// Add a new user to the database if the email is not already taken.
export async function POST(req: Request) {
    const body = (await req.json()) as ApiUserAdd

    const result = validationSchema.safeParse({ name: body.name, email: body.email, password: body.password })
    if (!result.success) {
        return new Response(null, { status: 400, statusText: 'Invalid request.' })
    }

    // Add user to database.
    try {
        const results = await AppDatabase.addUser(body.name, body.email, body.password)

        if (results.ErrorCode == 2627) {
            return new Response(null, { status: 400, statusText: 'A user with this email already exists.' })
        }

        return new Response(null, { status: 200 })
    } catch (error) {
        return new Response(null, { status: 500, statusText: 'There was a connection error.' })
    }
}
