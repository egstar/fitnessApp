import * as env from "@/data/config";
import { getSession, unsetSession } from "@/models/Dashboard/Users/Users";
import { NextApiRequest, NextApiResponse } from "next";


export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<any> {
    if(req.method !== 'POST' && req.headers.origin !== env.WEBSITE){
        res.status(400).json({error: `Error, Access denied`})
    }
    const sessionToken = req.cookies[env.uToken]
    
    if(!sessionToken) {
        res.status(400).json({error: `User isn't logged in`})
    }
    
    const userSession = await getSession(sessionToken!)
    if(!userSession){
        res.status(403).json({error: `Forbidden`})
    }

    const remSession = await unsetSession(userSession.uid)
    
    if(remSession) {
        res.status(200).json({message: `User logged out`})
    } else {
        res.status(300).json({error: `User isn't logged in`})
    }
}