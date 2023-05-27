import DbConn from "@/data/Database";

export const getTodayTasks = async(uid: number): Promise<any> => {
    try {
        const conn = await DbConn.connect();
        const sQuery = "select distinct ut.*,pduration,tname,dsc,pname,pstart from user_plans AS up JOIN user_plan_tasks AS ut ON up.uid=ut.uid AND up.pid=ut.pid JOIN tasks AS tsk ON ut.tid=tsk.id WHERE tdate=CURRENT_DATE AND ut.uid=$1 ORDER BY uid,pid,pduration,tid"
        const tresult = await conn.query(sQuery, [uid])
        conn.release();
        
        return  tresult.rows
    } catch(e) {
        throw new Error(`No connection`)
    }

}

export const getPlanTasks = async(uid: number, pid: number): Promise<any> => {
    try {
        const conn = await DbConn.connect();
        const sQuery = "select distinct ut.*,pduration,tname,dsc,pname,pstart from user_plans AS up JOIN user_plan_tasks AS ut ON up.uid=ut.uid AND up.pid=ut.pid JOIN tasks AS tsk ON ut.tid=tsk.id WHERE ut.uid=$1 AND ut.pid=$2 ORDER BY tdate DESC,pid,pduration,tid"
        const result = await conn.query(sQuery, [uid,pid])
        conn.release();
        return result.rows
    } catch(e) {
        throw new Error(`Error, ${e}`)
    }
}