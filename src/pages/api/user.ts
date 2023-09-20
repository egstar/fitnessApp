import { NextApiRequest, NextApiResponse } from "next";
import { getSession, getUserById } from '@/models/Dashboard/Users/Users';
import { User, uSession } from "@/data/types";
import * as env from "@/data/config";



export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<User|any> {
    if(req.method !== 'POST' && req.headers.origin !== env.WEBSITE! ){
        return res.status(400).json({error: `Connction refused`})
        
    } else {
        const userLogged = req.cookies![env.uToken]
        if(!userLogged){
            return res.status(400).json({error: `Please login first`})
        }
        const userSession: uSession = await getSession(userLogged!)

        if(!userSession) {
            return res.status(400).json({error: `Session timeout, please relogin`})
        } else {
            const loggedUser: User = await getUserById(userSession.uid)
            if(!loggedUser) {
                return res.status(400).json({error: `User does not exist`})
            } else {
                return res.status(200).json(loggedUser)
            }
        }
    }
    
}