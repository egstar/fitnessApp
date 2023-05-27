import { uToken } from "@/data/config";
import { createUserPlan } from "@/models/Dashboard/Plans/Userplans";
import { getSession } from "@/models/Dashboard/Users/Users";
import { NextApiRequest, NextApiResponse } from "next";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if(req.method !== 'PUT' && req.headers.origin !== 'http://localhost:3000'){
        throw new Error('Error, Access denied')
    }
    const currentSession = await getSession(req.cookies[uToken]!)
    if(!currentSession.uid) {
        throw new Error('Session has been ended, please relogin')
    }
    const {planName,planStart,planDuration,planTasks} = req.body;
    if(!planName || !planStart || !planDuration) {
        throw new Error(`Error, plan details are missing, please enter all required fields`)
    }
    const createPlan = await createUserPlan(currentSession.uid,planDuration,planStart, planName, planTasks!)
    if(!createPlan){
        throw new Error(`Error, Plan creation field`)
    }

    res.status(200).json(createPlan)
}