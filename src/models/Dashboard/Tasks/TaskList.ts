import DbConn from "@/data/Database";

export const getTasks = async(): Promise<any> => {
    try {
        const conn = await DbConn.connect();
        const gtQuery: string = "SELECT * FROM tasks ORDER BY id ASC"
        const taskList = await conn.query(gtQuery)
        conn.release();

        return taskList.rows
    } catch(e) {
        throw new Error(`Access denied! ${e}`);
    }

}

export const getTask = async(taskId: number): Promise<any> => {
    try {
        if(isNaN(Number(taskId))){
            throw new Error(`Invalid task id`)
        } else {
        const conn = await DbConn.connect();
        const gtQuery: string = "SELECT * FROM tasks WHERE id=$1"
        const result = await conn.query(gtQuery, [taskId])
        conn.release();

        return result.rows;
        }
    } catch (e) {
        throw new Error(`Access denied! ${e}`)
    }
}
