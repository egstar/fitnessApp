import { getTodayTasks } from "@/models/Dashboard/Tasks/TodayTasks";
import { getSession } from "@/models/Dashboard/Users/Users";
import { NextApiRequest, NextApiResponse } from "next";
import * as env from '@/data/config'

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>){
    if(req.method !== "POST" && req.headers.origin !== env.WEBSITE){
        res.status(400).json({error: `Error, Access denied!`})
    }
    const getUser = await getSession(req.cookies![env.uToken] as string)
    const getTime = await getTodayTasks(getUser.uid)
    
    const Tasks = getTime ? getTime : null
    
    if(Tasks){
        res.status(200)
        .json(Tasks)
    } else {
        res.status(203).json(null)
    }

}