import { User } from "@/data/types";
import { setCookie, verifyPass } from "@/models/Dashboard/Users/Login";
import { findUser, getUser } from "@/models/Dashboard/Users/Users";
import { NextApiRequest, NextApiResponse } from "next";

import * as env from "@/data/config";


export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<User|void> {
    if(req.method !== 'POST' && req.headers.origin !== env.WEBSITE){
        res.status(400).json('Error, Access denied')
    }

        const {user, upass} = req.body
        if(!user || !upass) res.status(400).json('Missing user/password fields')

        const fUser = await findUser(user)
        if(!fUser){
            res.status(400).json('User not found!')
        }
        const vUser = await verifyPass(user,upass)
        if(!vUser){
            res.status(400).json(`Wrong Password !`)
        }
        const gUser: User = await getUser(user)
        if(!gUser){
            res.status(400).json(`Forbidden, or No access!`)
        }

        const cookie = await setCookie(res, gUser)
        if(!cookie){
            res.status(400).json(`Forbidden, or No access!`)
        }

        return res.status(200).json({gUser, cookie})

}
