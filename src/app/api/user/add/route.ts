import AppDatabase from '@/lib/database'

// Add a new user to the database if the email is not already taken.
export async function POST(req: Request) {
    const body = await req.json()

    // Check if user information is null.
    if (!body?.name || !body?.email || !body?.password) {
        return new Response(null, { status: 400, statusText: 'Please fill in all required fields.' })
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
