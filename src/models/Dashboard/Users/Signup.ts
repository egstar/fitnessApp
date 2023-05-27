import DbConn from "@/data/Database";
import { User } from "@/data/types";

export const createUser = async(user: User): Promise<void> => {
    
    try {
        const conn = await DbConn.connect();
        const sQuery = `WITH cuser AS (
            INSERT INTO users (uname, fname, lname, email, passwd, regdate) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *)
            INSERT INTO user_levels VALUES ((SELECT id FROM cuser), 1) RETURNING *`
        const tQuery = `SELECT CURRENT_TIMESTAMP as date`
        const tResult = await conn.query(tQuery)
        const result = await conn.query(sQuery, [user.uname?.toLowerCase(), user.fname, user.lname, user.email?.toLowerCase(), user.passwd, tResult.rows[0].date])
        conn.release()

        if(!result.rows[0].uid){
            throw new Error(`User creation failed.`)
        }
        return 
    } catch(e) {
        throw new Error(`Error ${e}`)
    }
    


}