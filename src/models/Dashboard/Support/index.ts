import DbConn from "@/data/Database"

export const getTickets = async(uid: number): Promise<any> => {
    try {
        const conn = await DbConn.connect()
        const sQuery = `SELECT (SELECT COUNT(*) from support where uid=$1) AS total,(SELECT COUNT(*) from support where uid=$1 AND status=0) AS open, (SELECT COUNT(*) from support where uid=$1 AND status=1) AS closed, (SELECT COUNT(*) from support where uid=$1 AND status=2) AS solvd, uid,topic,cat,status,tm.* from support AS sp INNER JOIN ticket_messages AS tm on sp.id=tm.ticket_id WHERE uid=$1 ORDER BY status ASC`
        const result = await conn.query (sQuery, [uid])
        conn.release()
        if(!result.rows) throw new Error(`${result}`)
        return result.rows
    } catch(e: any) {
        return Error(e)
    }
}

export const createTicket = async(uid: number, desc: string, cat: string,msg :string): Promise<any> => {
    try {
        const conn = await DbConn.connect()
        const sQuery = `WITH ct as (INSERT INTO support(uid,topic,cat) VALUES ($1,$2,$3) RETURNING *)
        INSERT INTO ticket_messages(ticket_id,message,sender,tdate) VALUES ((SELECT id FROM ct), $4,(SELECT uname FROM users WHERE id=$1),(SELECT CURRENT_TIMESTAMP)) RETURNING *`
        const result = await conn.query(sQuery, [Number(uid),desc,cat,msg])
        conn.release()
        if(!result.rows) throw new Error(`${result}`)
        
        return result.rows[0]
    } catch(e: any) {
        return Error(e)
    }
}

export const updateTicket = async(tid: number, uid: number, status: string): Promise<any> => {
    try {
        const conn = await DbConn.connect()
        const sQuery = `UPDATE support SET status=$1 WHERE id=$2 AND uid=$3  RETURNING *`
        const result = await conn.query(sQuery, [status, tid, uid])
        conn.release()
        if(!result.rows) throw new Error(`${result}`)
        
        return result.rows[0]
    } catch(e: any) {
        return Error(e)
    }
}

export const userReply = async(tid: number, uid: number,msg :string): Promise<any> => {
    try {
        const conn = await DbConn.connect()
        const sQuery = `INSERT INTO ticket_messages(ticket_id,message,sender,tdate) VALUES ($1,$2,(SELECT uname FROM users where id=$3),(SELECT CURRENT_TIMESTAMP)) RETURNING *`
        const result = await conn.query(sQuery, [tid,msg,uid])
        
        conn.release()
        if(!result.rows) throw new Error(`${result}`)
        
        return result.rows[0]
    } catch(e: any) {
        return Error(e)
    }
}

export const sysReply = async(tid: number,msg :string): Promise<any> => {
    try {
        const conn = await DbConn.connect()
        const sQuery = `INSERT INTO ticket_messages(ticket_id,message,sender,tdate) VALUES ($1,$2,'Support',(SELECT CURRENT_TIMESTAMP)) RETURNING *`
        const result = await conn.query(sQuery, [tid,msg])
        conn.release()
        if(!result.rows) throw new Error(`${result}`)
        
        return result.rows[0]
    } catch(e: any) {
        return Error(e)
    }
}


export const deleteTicket = async(tid: number): Promise<any> => {
    try {
        const conn = await DbConn.connect()
        const sQuery = `DELETE FROM support WHERE id=$1 RETURNING *`
        const result = await conn.query(sQuery, [tid])
        conn.release
        if(!result.rows) throw new Error(`${result}`)

        return result.rows
    } catch(e: any) {
        return Error(e)
    }
}