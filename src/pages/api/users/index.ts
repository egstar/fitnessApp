import * as env from '@/data/config'
import { getAllUsers } from '@/models/Dashboard/Admin/usersList';
import { getSession } from '@/models/Dashboard/Users/Users';
import { uToken } from '@/pages';
import { NextApiRequest, NextApiResponse } from "next";



export default async function handler(req: NextApiRequest, res: NextApiResponse){
    // if(req.headers.origin != env.WEBSITE) res.status(400).json(`Access denied`)

    if(!req.cookies || !req.cookies![uToken]) res.status(403).json(`Access denied`)

    const isAdmin = await getSession(req.cookies[uToken]!)
    if(!isAdmin || (isAdmin && isAdmin.lid < 3)) res.status(300).json(`Only admins are premitted to do this action`)
    if(req.method == 'GET'){

        const usrList = await getAllUsers()
        if(!usrList) res.status(300).json(`Error fetching users`)
        
        res.status(200).json(usrList)

    }
    
}