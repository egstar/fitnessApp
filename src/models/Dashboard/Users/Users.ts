import DbConn from "@/data/Database"
import { User, uSession } from "@/data/types";

export const findUser = async(uname: string): Promise<boolean> => {
    try {
        const conn = await DbConn.connect();
        const sQuery = `SELECT id from users INNER JOIN user_levels ON id=uid WHERE uname=$1 OR email=$1`
        const result = await conn.query(sQuery, [uname.toLowerCase()])
        conn.release();

        return result.rows.length > 0
    } catch(e) {
        throw new Error(`Error, ${e}`)
    }
}

export const getPass = async(uname: string): Promise<string> => {
    try {
        const conn = await DbConn.connect();
        const sQuery = `SELECT passwd from users WHERE uname=$1 OR email=$1`
        const result = await conn.query(sQuery, [uname.toLowerCase()])
        conn.release();

        return result.rows[0].passwd
    } catch(e) {
        throw new Error(`Error, ${e}`)
    }
}

export const getUser = async(uname: string): Promise<User> => {
    try {
        const conn = await DbConn.connect();
        const sQuery = `SELECT id,img,uname,fname,lname,email,regdate,lid from users INNER JOIN user_levels ON id=uid WHERE uname=$1 OR email=$1`
        const result = await conn.query(sQuery, [uname.toLowerCase()])
        conn.release();
        
        let loggedUser: User= result.rows[0]
        return loggedUser
    } catch(e) {
        throw new Error(`Error, ${e}`)
    }
}

export const getUserById = async (id: number): Promise<User> => {
    try {
        const conn = await DbConn.connect();
        const sQuery = `SELECT uid,img,uname,fname,lname,email,regdate,lid,levels.level from users INNER JOIN user_levels ON users.id=uid INNER JOIN levels on lid=levels.id WHERE uid=$1`
        const result = await conn.query(sQuery, [id])
        conn.release();
        
        return result.rows[0] as User
    } catch(e) {
        throw new Error(`Error, ${e}`)
    }
}

export const setSession = async(sid: string, uid: number, lid: number): Promise<uSession> => {
    try {
        const conn = await DbConn.connect();
        const sQuery = `INSERT INTO user_sessions VALUES ($1,$2,$3) RETURNING *`
        const result = await conn.query(sQuery, [sid,uid,lid])
        conn.release();

        return result.rows[0] as unknown as uSession
    } catch(e) {
        throw new Error(`Error, ${e}`)
    }
}

export const getSession = async(sid: string): Promise<uSession> => {
    try {
        const conn = await DbConn.connect();
        const sQuery = "SELECT * FROM user_sessions WHERE sid=$1 AND sexpiry > CURRENT_TIMESTAMP"
        const result = await conn.query(sQuery, [sid])
        conn.release();

        return result.rows[0] as unknown as uSession
    } catch(e) {
        throw new Error(`Error, ${e}`)
    }
}


export const unsetSession = async(uid: number): Promise<boolean> => {
    try {
        const conn = await DbConn.connect();
        const sQuery = "DELETE FROM user_sessions WHERE uid=$1 RETURNING *"
        await conn.query(sQuery, [uid])
        conn.release();
        
        return true
    } catch(e) {
        throw new Error(`Error, ${e}`)
    }
}

export const checkUser = async(sid: string): Promise<User> => {
    try {
        const sessionFound = await getSession(sid)
        if(!sessionFound) throw new Error(`Error, Session has been expired, please relogin`)
        const userInfo: User = await getUserById(sessionFound.uid)
        if(!userInfo) throw new Error(`Error, Access denied, please relogin`)

        return userInfo
    } catch(e) {
        throw new Error(`Error, ${e}`)
    }
}