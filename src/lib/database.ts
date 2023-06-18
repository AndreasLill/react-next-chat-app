import { hashCompare, hashPass } from './crypt'
import { SessionUser } from '@/types/auth'
import { User } from '@/types/user'

const sql = require('mssql')
const sqlConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    server: process.env.DB_HOST,
    parseJSON: true,
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
            await pool
                .request()
                .input('pName', sql.NVarChar(32), name)
                .input('pPassword', sql.VarChar(60), hashedPass)
                .input('pEmail', sql.VarChar(255), email)
                .query('INSERT INTO [User](Name, Password, Email) VALUES(@pName, @pPassword, @pEmail)')
            console.log(`Added user '${email}' to the database.`)
        } catch (error: any) {
            console.error(error)
            throw new Error(error)
        }
    }

    static async getUser(userId: string) {
        try {
            const pool = await sql.connect(sqlConfig)
            const results = await pool.request().input('pUserId', sql.UniqueIdentifier, userId)
                .query(`SELECT ID AS 'id', Email AS 'email', Name AS 'name',
                (SELECT r.ID AS 'id', r.Name AS 'name', rj.Role AS 'role' FROM [dbo].[Room] AS r JOIN [dbo].[RoomJoin] as rj ON r.ID = rj.RoomID WHERE rj.UserID = [User].ID FOR JSON PATH) as 'rooms'
                FROM [dbo].[User]
                WHERE ID = @pUserId
                FOR JSON PATH, WITHOUT_ARRAY_WRAPPER`)
            return results.recordset[0] as User
        } catch (error: any) {
            console.error(error)
            throw new Error(error)
        }
    }

    // OUTPUT inserted.ID
    static async addRoom(userId: string, name: string) {
        try {
            const pool = await sql.connect(sqlConfig)
            const results = await pool
                .request()
                .input('UserId', sql.UniqueIdentifier, userId)
                .input('RoomName', sql.VarChar(255), name)
                .execute('[dbo].[CreateRoom]')
            console.log(`Added room '${results.recordset[0].ID}' to the database.`)
            return results.recordset[0].ID as string
        } catch (error: any) {
            console.error(error)
            throw new Error(error)
        }
    }

    static async joinRoom(userId: string, roomId: string) {
        try {
            const pool = await sql.connect(sqlConfig)
            const results = await pool
                .request()
                .input('UserId', sql.UniqueIdentifier, userId)
                .input('RoomId', sql.UniqueIdentifier, roomId)
                .execute('[dbo].[JoinRoom]')

            if (results.recordset[0].ErrorMessage) {
                console.error(`${results.recordset[0].ErrorCode} : ${results.recordset[0].ErrorMessage}`)
            } else {
                console.log(`User ${userId} joined room ${roomId}.`)
            }
            return results.recordset[0]
        } catch (error: any) {
            console.error(error)
            throw new Error(error)
        }
    }
}
