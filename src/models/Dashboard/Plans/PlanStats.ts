import DbConn from "@/data/Database"

export const tasksCount = async(tid: number, pid: number, uid: number) => {
    try {
        const conn = await DbConn.connect()
        const sQuery = "SELECT COUNT(*) from user_plan_tasks WHERE uid=$1 AND pid=$2 AND tid=$3"
        const result = await conn.query(sQuery, [uid,pid,tid])

        conn.release();
        return result
    } catch(e) {
        throw new Error(`Error, ${e}`)
    }
}


export const doneCountPercent = async(tid: number, pid: number, uid: number) => {
    try {
        const conn = await DbConn.connect()
        const sQuery = "SELECT AVG(CASE WHEN tstatus = 1 THEN 100.0 ELSE 0 END) FROM user_plan_tasks WHERE uid=$1 AND pid=$2 AND tid=$3"
        const result = await conn.query(sQuery, [uid,pid,tid])

        conn.release();
        return result.rows
    } catch(e) {
        throw new Error(`Error, ${e}`)
    }

}

export const getDefaultPlans = async() => {
    try {
        const conn = await DbConn.connect()
        const sQuery = "SELECT * from plans ORDER BY duration ASC"
        const result = await conn.query(sQuery)

        conn.release()
        return result.rows
    } catch(e) {
        throw new Error(`Error, ${e}`)
    }
}

