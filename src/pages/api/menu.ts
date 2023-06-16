import { getMenu } from '@/models/Dashboard/Settings'
import { MenuItem } from '@/data/types';
import type { NextApiRequest, NextApiResponse } from 'next'
import * as env from '@/data/config';
import { getSession } from '@/models/Dashboard/Users/Users';

export default async function handler(req: NextApiRequest, res: NextApiResponse<MenuItem[] | object >) {
    const cookieToken = req.cookies[env.uToken]
    if(!cookieToken) res.status(400).send({error: `User isn't logged in`})
    const cSession = await getSession(cookieToken!)
    if(!cSession) res.status(400).send({error: 'User session has been expired please relogin'})
    const userLevel: number = cSession.lid;
    const items = await getMenu(userLevel);
    if(req.method === 'GET' && userLevel > 0){
        res.status(200).json(items)
    } else {
        console.log(env.WEBSITE,req.headers.origin)
        res.status(400).json({error: 'Permission denied'})
    }
}