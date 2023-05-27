import { getTask } from "@/models/Dashboard/Tasks/TaskList";
import { getTodayTasks } from "@/models/Dashboard/Tasks/TodayTasks";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
    const taskId = req.query.taskId as unknown as number
    
    const Task = await getTask(Number(taskId))

    if(req.method === "GET"){
        res.status(200)
        .send(Task)
    }
}