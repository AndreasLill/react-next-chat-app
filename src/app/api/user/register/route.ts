import AppDatabase from '@/lib/database'

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
