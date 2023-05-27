import { getTasks } from "@/models/Dashboard/Tasks/TaskList";
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
    const TaskList = await getTasks()
    if(req.method === "GET"){
        res.status(200)
        .send(TaskList)
    }
}