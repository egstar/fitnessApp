import { NextApiRequest, NextApiResponse } from "next";
import { getSession, getUserById } from '@/models/Dashboard/Users/Users';
import { User, uSession } from "@/data/types";
import { uToken } from "@/data/config";



export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<User|void> {
    if(req.method !== 'POST' && req.headers.origin !== 'https://fitness-app-dun.vercel.app'){
        throw new Error('Error, Access denied')
    }
    const userLogged = req.cookies![uToken]
    const userSession: uSession = await getSession(userLogged!)

    if(!userSession) {
        throw new Error('Error, Access denied')
    }
    const loggedUser: User = await getUserById(userSession.uid)
    return res.status(200).json(loggedUser)
}