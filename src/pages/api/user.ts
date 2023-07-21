import { NextApiRequest, NextApiResponse } from "next";
import { getSession, getUserById } from '@/models/Dashboard/Users/Users';
import { User, uSession } from "@/data/types";
import * as env from "@/data/config";



export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<User|any> {
    if(req.method !== 'POST' && req.headers.origin !== env.WEBSITE! ){
        res.status(400).json({error: 'Error, Access denied'})
    }
    const userLogged = req.cookies![env.uToken]
    const userSession: uSession = await getSession(userLogged!)

    if(!userSession) {
        res.status(400).json({error: 'Error, Access denied'})
    }
    const loggedUser: User = await getUserById(userSession.uid)
    return res.status(200).json(loggedUser)
}