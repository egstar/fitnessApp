import { uToken } from "@/data/config";
import { getTodayTasks } from "@/models/Dashboard/Tasks/TodayTasks";
import { getSession } from "@/models/Dashboard/Users/Users";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>){
    if(req.method !== "POST"){
        throw new Error(`Error, Access denied!`)
    }
    const getUser = await getSession(req.cookies![uToken] as string)
    const getTime = await getTodayTasks(getUser.uid)
    
    const Tasks = getTime ? getTime : null
    
    if(Tasks){
        res.status(200)
        .json(Tasks)
    } else {
        res.status(203).json(null)
    }

}