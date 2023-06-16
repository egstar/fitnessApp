import { getTask } from "@/models/Dashboard/Tasks/TaskList";
import type { NextApiRequest, NextApiResponse } from "next";
import * as env from '@/data/config'

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
    const taskId = req.query.taskId as unknown as number
    
    const Task = await getTask(Number(taskId))

    if(req.method === "GET" && req.headers.origin === env.WEBSITE){
        res.status(200).json(Task)
    }
}