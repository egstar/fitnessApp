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
        return result.rows[0]
    } catch(e: any) {
        return Error(e)
    }
}

export const setUserLevel = async(uid: number, lid: number) => {
    try {
        const conn = await DbConn.connect()
        const sQuery = `WITH ulvl AS(UPDATE user_levels SET lid=$1 WHERE uid=$2 RETURNING *),
                        uss AS(UPDATE user_sessions SET lid=(SELECT lid FROM ulvl) WHERE uid=(SELECT uid from ulvl) RETURNING *)
                        SELECT * FROM user_levels WHERE uid=$2`
        const result = await conn.query(sQuery, [lid,uid])
        conn.release()

        if(!result.rows) throw new Error(result as unknown as any)
        return result.rows[0]
    } catch(e: any) {
        return Error(e)
    }
}