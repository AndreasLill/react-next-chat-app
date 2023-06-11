import { User } from '../types/user'
import { hashCompare, hashPass } from '../lib/crypt'
import { DbUser } from './dbtypes'

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

    static async getUser(username: string, password: string) {
        try {
            const pool = await sql.connect(sqlConfig)
            const results = await pool.query(`SELECT ID, Name, Password, Email FROM [User] WHERE Name = '${username}'`)
            const user = results.recordset as DbUser[]

            if (user[0]) {
                const success = await hashCompare(password, user[0].Password)

                if (!success) {
                    console.log('wrong password.')
                    return null
                }

                console.log('authentication success!')
                return {
                    id: user[0].ID,
                    name: user[0].Name,
                    email: user[0].Email
                } as User
            } else {
                console.log('user not found.')
                return null
            }
        } catch (error) {
            console.error(error)
            return null
        }
    }

    static async addUser(username: string, password: string, email: string) {
        const hashedPass = await hashPass(password)
        const pool = await sql.connect(sqlConfig)
        const ps = new sql.PreparedStatement(pool)
        ps.input('pName', sql.NVarChar(32))
        ps.input('pPassword', sql.VarChar(60))
        ps.input('pEmail', sql.VarChar(255))
        try {
            await ps.prepare('INSERT INTO [User](Name, Password, Email) VALUES(@pName, @pPassword, @pEmail)')
            await ps.execute({
                pName: username,
                pPassword: hashedPass,
                pEmail: email
            })
            console.log('added user')
        } catch (error) {
            console.error(error)
        } finally {
            await ps.unprepare()
        }
    }
}
