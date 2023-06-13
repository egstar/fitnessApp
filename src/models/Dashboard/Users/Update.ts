import DbConn from "@/data/Database"
import { User } from "@/data/types"


export const UpdateInfo = async(uid: number, fname: string, lname: string, email: string): Promise<User|undefined> => {
    try {
        const conn = await DbConn.connect()
        const sQuery = `UPDATE users SET (fname,lname,email)=($1,$2,$3) WHERE id=$4 RETURNING uname,fname,lname,email`
        const result = await conn.query(sQuery, [fname,lname,email,uid])
        conn.release();
        if(result.rows.length) return result.rows[0] as User
        return
    } catch(e) {
        throw new Error(`Error, ${e}`)
    }
}
export const updatePassword = async(uid: number, newPass: string): Promise<User|undefined> => {
    try {
        const conn = await DbConn.connect()
        const sQuery = `UPDATE users SET passwd=$1 WHERE id=$2 RETURNING uname`
        const result = await conn.query(sQuery, [newPass,uid])
        conn.release();
        if(result.rows.length) return result.rows[0] as User
        return
    } catch(e) {
        throw new Error(`Error, ${e}`)
    }
}
export const updateImage = async(uid: number, img:string): Promise<User|undefined> => {
    try {
        const conn = await DbConn.connect()
        const sQuery = `UPDATE users SET img=$1 WHERE id=$2 RETURNING uname`
        const result = await conn.query(sQuery, [img,uid])
        conn.release();
        if(result.rows.length) return result.rows[0] as User
        return
    } catch(e) {
        throw new Error(`Error, ${e}`)
    }
}