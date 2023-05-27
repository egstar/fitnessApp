import DbConn from "@/data/Database"
import { Task } from "@/data/types";

export const taskDone = async(uid: number, tid: number, pid: number): Promise<Task | Error> => {

    try {
        const conn = await DbConn.connect();
        const sQuery = "UPDATE user_plan_tasks set tstatus=1 WHERE tdate=CURRENT_DATE AND pid=$1 AND tid=$2 AND uid=$3 RETURNING *"
        const result = await conn.query(sQuery, [pid,tid,uid])

        conn.release();
        const taskup: Task = result.rows[0]
        return taskup
    } catch(e) {
        return Error(`Failed, ${e}`)
    }
}
export const taskUndone = async(uid: number, tid: number, pid: number): Promise<Task | Error> => {

    try {
        const conn = await DbConn.connect();
        const sQuery = "UPDATE user_plan_tasks set tstatus=0 WHERE tdate=CURRENT_DATE AND pid=$1 AND tid=$2 AND uid=$3 RETURNING *"
        const result = await conn.query(sQuery, [pid,tid,uid])

        conn.release();
        const taskup: Task = result.rows[0]
        return taskup
    } catch(e) {
        return Error(`Failed, ${e}`)
    }
}