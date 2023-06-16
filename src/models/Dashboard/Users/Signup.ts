import DbConn from "@/data/Database";
import { User } from "@/data/types";

export const createUser = async(user: User): Promise<any> => {    
    try {
        const conn = await DbConn.connect();
        const sQuery = `WITH cuser AS (
            INSERT INTO users (uname, fname, lname, email, passwd, regdate) VALUES ($1,$2,$3,$4,$5,(SELECT CURRENT_TIMESTAMP)) RETURNING *)
            INSERT INTO user_levels VALUES ((SELECT id FROM cuser), 1) RETURNING *`
        const result = await conn.query(sQuery, [user.uname?.toLowerCase(), user.fname, user.lname, user.email?.toLowerCase(), user.passwd])
        conn.release()

        if(result.rows.length <= 0){
            throw new Error(`User creation failed, ${result}`)
        }
        return result.rows[0]
    } catch(e) {
        return e
    }   
}