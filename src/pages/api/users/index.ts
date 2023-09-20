import * as env from '@/data/config'
import { getAllUsers } from '@/models/Dashboard/Admin/usersList';
import { getSession } from '@/models/Dashboard/Users/Users';
import { uToken } from '@/pages';
import { NextApiRequest, NextApiResponse } from "next";



export default async function handler(req: NextApiRequest, res: NextApiResponse){
    if(req.method !== 'GET' && req.headers.origin !== env.WEBSITE!) return res.status(400).json(`Connection refused`)

    if(!req.cookies || !req.cookies![uToken]) return res.status(403).json({error:`Access denied`})

    const isAdmin = await getSession(req.cookies[uToken]!)
    
    if(!isAdmin || (isAdmin && isAdmin.lid < 3)) return res.status(300).json({error:`Only admins are premitted to do this action`})
    if(req.method == 'GET'){
        const usrList = await getAllUsers()
        if(!usrList) res.status(300).json({error:`Error fetching users`})
        return res.status(200).json(usrList)
    }
    
}