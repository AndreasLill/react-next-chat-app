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

    static async getUser(email: string, password: string) {
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
        const hashedPass = await hashPass(password)
        const pool = await sql.connect(sqlConfig)
        const ps = new sql.PreparedStatement(pool)
        ps.input('pName', sql.NVarChar(32))
        ps.input('pPassword', sql.VarChar(60))
        ps.input('pEmail', sql.VarChar(255))
        try {
            await ps.prepare('INSERT INTO [User](Name, Password, Email) VALUES(@pName, @pPassword, @pEmail)')
            await ps.execute({
                pName: name,
                pPassword: hashedPass,
                pEmail: email
            })
            console.log(`Added user '${email}' to the database.`)
        } catch (error: any) {
            console.error(error)
            throw new Error(error)
        } finally {
            await ps.unprepare()
        }
    }
}
