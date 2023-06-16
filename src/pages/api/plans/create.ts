import * as env from "@/data/config";
import { createUserPlan } from "@/models/Dashboard/Plans/Userplans";
import { getSession } from "@/models/Dashboard/Users/Users";
import { NextApiRequest, NextApiResponse } from "next";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if(req.method !== 'PUT' && req.headers.origin !== env.WEBSITE){
        res.status(400).json({error: 'Error, Access denied'})
    }
    const currentSession = await getSession(req.cookies[env.uToken]!)
    if(!currentSession.uid) {
        res.status(400).json({error:'Session has been ended, please relogin'})
    }
    const {planName,planStart,planDuration,planTasks} = req.body;
    if(!planName || !planStart || !planDuration) {
        res.status(400).json({error:`Error, plan details are missing, please enter all required fields`})
    }
    const createPlan = await createUserPlan(currentSession.uid,planDuration,planStart, planName, planTasks!)
    if(!createPlan){
        res.status(400).json({error:`Error, Plan creation field`})
    }

    res.status(200).json(createPlan)
}