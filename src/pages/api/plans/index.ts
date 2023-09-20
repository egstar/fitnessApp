import { uToken } from "@/data/config";
import { getUserPlans } from "@/models/Dashboard/Plans/Userplans";
import { getPlanTasks } from "@/models/Dashboard/Tasks/TodayTasks";
import { getSession } from "@/models/Dashboard/Users/Users";
import { NextApiRequest, NextApiResponse } from "next";
import * as env from '@/data/config'
export default async function handler(req:NextApiRequest, res: NextApiResponse){

    if(req.method !== 'POST' && req.headers.origin !== env.WEBSITE) res.status(400).json({error: `Forbidden`})
    const planTask:any = []
    const userSession = req.cookies[uToken]
    const getUserSession = await getSession(userSession!)
    if(!getUserSession) {
        res.status(400).json({error: `Error, Access is denied!`})
    }
    const uid = getUserSession.uid;
    const userPlans = await getUserPlans(uid)

    if(!userPlans) {
        res.status(203).json(`User has not started any plans`)
    }
    
    for(let i =0; i<userPlans.length;i++){
        let planTasks = await getPlanTasks(uid,userPlans[i].pid)
        let tasksAvg: number = Object.entries(planTasks)
        .filter((obj: any) => Number(obj[1].tstatus) == 1).map((res: any) => {
            return res[1]
        }).length
        let doneTasks: any = {};
        const tasksLists: {} = planTasks.reduce((plans: any,tsks: any) =>{ 
            doneTasks = {...doneTasks, [tsks.tname]: Number([doneTasks[tsks.tname]? doneTasks[tsks.tname]+Number(tsks.tstatus): +Number(tsks.tstatus)])}
            return ({
                ...plans,
                [tsks.tdate]: [...(plans[tsks.tdate] || []), tsks]
            })
        }, {})
        planTask.push({plan: userPlans[i].pname, pid: userPlans[i].pid, planStart: userPlans[i].pstart, planDuration: userPlans[i].pduuration, planEnd: new Date(new Date(userPlans[i].pstart).valueOf() + (1000 * 60 * 60 * 24 * userPlans[i].pduration)) , planStates: {tasksDone: doneTasks, totalDone: tasksAvg!, totalTasks: planTasks.length}, tasks: tasksLists})
    }
    res.status(200).json(planTask)
}