import { getMenu } from '@/models/Dashboard/Settings'
import { MenuItem } from '@/data/types';
import type { NextApiRequest, NextApiResponse } from 'next'
import { uToken } from '@/data/config';
import { getSession } from '@/models/Dashboard/Users/Users';

export default async function handler(req: NextApiRequest, res: NextApiResponse<MenuItem[] | string>) {
    const cookieToken = req.cookies[uToken]
    if(!cookieToken) return res.status(400).send(`Permission denied!`)
    const cSession = await getSession(cookieToken!)
    if(!cSession) return res.status(400).send(`Permission denied!`)
    const userLevel: number = cSession.lid;
    const items = await getMenu(userLevel);
    if(req.method === 'GET' && userLevel > 0){
        res.status(200)
        .json(items)
    }
}