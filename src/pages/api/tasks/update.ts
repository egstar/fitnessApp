import { uToken } from "@/data/config";
import { taskDone, taskUndone } from "@/models/Dashboard/Tasks/Tasks";
import { getSession } from "@/models/Dashboard/Users/Users";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>){

    if(req.method !== 'PUT' && req.headers.origin !== 'http://localhost:3000'){
        throw new Error('Error, Access denied')
    }

    const {uid,pid,tid,tupdate} = req.body
    if(!tupdate && !tid && !pid && !uid) {
        throw new Error(`Error, Access denied`)
    }
    const reqToken = req.cookies[uToken]!
    if(!reqToken) {
        throw new Error(`Error, Access denied`)
    }
    const currentSession = await getSession(reqToken)
    if(!currentSession){
        throw new Error(`Error, Expired session`)
    }
    if(tupdate == 'done') {
        const tstatus = await taskDone(uid, tid, pid)
        if(!tstatus) throw new Error(`Error, Failed to update request`)
        res.status(200).json(tstatus)

    } else if( tupdate == 'undone') {
        const tstatus = await taskUndone(uid,tid,pid)
        if(!tstatus) throw new Error(`Error, Failed to update request`)
        res.status(200).json(tstatus)
    } else {
        throw new Error(`Error, Unkown request`)
    }

    
}