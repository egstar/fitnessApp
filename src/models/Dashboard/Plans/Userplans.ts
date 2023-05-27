import DbConn from "@/data/Database"


export const getUserPlans = async(uid: number): Promise<any> => {
    try {
        const conn = await DbConn.connect();
        const sQuery = "SELECT * from user_plans WHERE uid=$1 ORDER BY pstart"
        const result = await conn.query(sQuery, [uid])

        conn.release();
        return result.rows
    } catch(e) {
        throw new Error(`Error, ${e}`)
    }

}

export const createUserPlan = async(uid: number, pduration: number, pstart: Date, pname: string, ptasks?: number[]) => {
    try {
        const conn = await DbConn.connect()
        let result;
        if(ptasks){
            const sQuery = `SELECT cpWithTasks($1,$2,$3,$4,$5)`
            result = await conn.query(sQuery, [uid,pname,pstart,pduration,ptasks])
        } else {
            const sQuery = `SELECT createplans($1,$2,$3,$4)`
            result = await conn.query(sQuery, [uid,pname,pstart,pduration])
        }
        conn.release();
        if(result.rows.length > 0) 
        return result.rows
    } catch(e) {
        throw new Error(`Error, ${e}`)
    }
}