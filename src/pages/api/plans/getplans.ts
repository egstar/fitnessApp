import { uToken } from "@/data/config";
import { getDefaultPlans } from "@/models/Dashboard/Plans/PlanStats";
import { getUserPlans } from "@/models/Dashboard/Plans/Userplans";
import { getTasks } from "@/models/Dashboard/Tasks/TaskList";
import { getSession } from "@/models/Dashboard/Users/Users";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if(req.method !== 'POST'  && req.headers.origin !== 'http://localhost:3000'){
        throw new Error(`Error, Forbiden acccess.`)
    }
    const session = req.cookies[uToken]!
    const userId = await getSession(session)
    if(!userId.uid) {
        throw new Error(`Error, Access denied`)
    }
    const defaultPlans = await getDefaultPlans()
    const userPlans = await getUserPlans(userId.uid)
    const defaultTasks = await getTasks()

    res.status(200).json({
        defaultP: defaultPlans,
        defaultT: defaultTasks,
        userP: userPlans
    })   
}