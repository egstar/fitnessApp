import { getTasks } from "@/models/Dashboard/Tasks/TaskList";
import type { NextApiRequest, NextApiResponse } from 'next'
import * as env from '@/data/config'

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
    const TaskList = await getTasks()
    if(req.method === "GET" && req.headers.origin == env.WEBSITE){
        res.status(200).json(TaskList)
    }
}