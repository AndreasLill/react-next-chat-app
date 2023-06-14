import { hashCompare, hashPass } from '../lib/crypt'
import { SessionUser } from '@/types/auth'

const sql = require('mssql')
const sqlConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    server: process.env.DB_HOST,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
}

export default class AppDatabase {
    private constructor() {}

    static async authenticateUser(email: string, password: string) {
        try {
            const pool = await sql.connect(sqlConfig)
            const results = await pool
                .request()
                .input('pEmail', sql.VarChar(255), email)
                .query('SELECT ID, Password FROM [User] WHERE Email = @pEmail')

            if (results.recordset) {
                const record = results.recordset[0]
                const success = await hashCompare(password, record.Password)

                if (!success) {
                    return null
                }

                console.log(`User ${email} has logged in.`)
                return {
                    id: record.ID
                } as SessionUser
            }
            return null
        } catch (error) {
            console.error(error)
            return null
        }
    }

    static async existsUser(email: string) {
        try {
            const pool = await sql.connect(sqlConfig)
            const results = await pool
                .request()
                .input('pEmail', sql.VarChar(255), email)
                .query('SELECT COUNT(*) as count FROM [User] WHERE Email = @pEmail')

            const exists = results.recordset[0].count !== 0
            if (exists) {
                console.log(`User '${email}' already exists.`)
            }
            return exists
        } catch (error: any) {
            console.error(error)
            throw new Error(error)
        }
    }

    static async addUser(name: string, email: string, password: string) {
        try {
            const hashedPass = await hashPass(password)
            const pool = await sql.connect(sqlConfig)
            const results = await pool
                .request()
                .input('pName', sql.NVarChar(32), name)
                .input('pPassword', sql.VarChar(60), hashedPass)
                .input('pEmail', sql.VarChar(255), email)
                .query('INSERT INTO [User](Name, Password, Email) OUTPUT inserted.ID VALUES(@pName, @pPassword, @pEmail)')
            console.log(`Added user '${results.recordset[0].ID}' to the database.`)
            return results.recordset[0].ID as string
        } catch (error: any) {
            console.error(error)
            throw new Error(error)
        }
    }

    static async addRoom(name: string) {
        try {
            const pool = await sql.connect(sqlConfig)
            const results = await pool
                .request()
                .input('pName', sql.VarChar(255), name)
                .query('INSERT INTO [Room](Name) OUTPUT inserted.ID VALUES(@pName)')
            console.log(`Added room '${results.recordset[0].ID}' to the database.`)
            return results.recordset[0].ID as string
        } catch (error: any) {
            console.error(error)
            throw new Error(error)
        }
    }
}
