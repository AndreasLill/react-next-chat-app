const bcrypt = require('bcrypt')

export async function hashPass(password: string) {
    return bcrypt.hash(password, 10) as string
}

export async function hashCompare(password: string, hashedPassword: string) {
    return bcrypt.compare(password, hashedPassword) as boolean
}
