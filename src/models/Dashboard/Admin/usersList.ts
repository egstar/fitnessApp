import DbConn from "@/data/Database"


export const getAllUsers = async() => {
    try {
        const conn = await DbConn.connect()
        const sQuery = 'SELECT * FROM user_sessions AS us RIGHT JOIN users ON users.id=uid INNER JOIN user_levels AS ul ON users.id=ul.uid ORDER BY id ASC'
        const result = await conn.query(sQuery)
        conn.release()

        if(!result.rows) throw new Error(result as unknown as any)
        return result.rows
    } catch(e: any) {
        return Error(e)
    }
}

export const killUserSession = async(uid: any) => {
    try {
        const conn = await DbConn.connect()
        const sQuery = 'DELETE FROM user_sessions WHERE uid=$1 RETURNING *'
        const result = await conn.query(sQuery, [uid])
        conn.release()

        if(!result.rows) throw new Error(result as unknown as any)
        return result.rows
    } catch(e: any) {
        return Error(e)
    }
}