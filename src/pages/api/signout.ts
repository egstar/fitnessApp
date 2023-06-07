import { uToken } from "@/data/config";
import { unsetCookie } from "@/models/Dashboard/Users/Login";
import { getSession, unsetSession } from "@/models/Dashboard/Users/Users";
import { NextApiRequest, NextApiResponse } from "next";
import { useCookies } from "react-cookie";

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    

    if(req.method !== 'POST'){
        throw new Error(`Error, Access denied`)
    }
    const sessionToken = req.cookies[uToken]
    
    if(!sessionToken) {
        res.status(400).json(`User isn't logged in`)        
    }
    
    const userSession = await getSession(sessionToken!)
    if(!userSession){
        res.status(403).json(`Forbidden`)
    }

    const remSession = await unsetSession(userSession.uid)
    
    if(remSession) {
        res.status(200).json(`User logged out`)
    } else {
        res.status(203).json(`User isn't logged in`)
    }
        

}