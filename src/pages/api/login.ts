import { User } from "@/data/types";
import { setCookie, verifyPass } from "@/models/Dashboard/Users/Login";
import { findUser, getUser } from "@/models/Dashboard/Users/Users";
import { NextApiRequest, NextApiResponse } from "next";

import { uToken } from "@/data/config";


export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<User|void> {
    if(req.method !== 'POST' && req.headers.origin !== 'https://fitness-app-dun.vercel.app'){
        throw new Error('Error, Access denied')
    }

        const {user, upass} = req.body
        if(!user || !upass) throw new Error('Missing user/password fields')

        const fUser = await findUser(user)
        if(!fUser){
            throw new Error('User not found!')
        }
        const vUser = await verifyPass(user,upass)
        if(!vUser){
            throw new Error(`Wrong Password !`)
        }
        const gUser: User = await getUser(user)
        if(!gUser){
            throw new Error(`Forbidden, or No access!`)
        }

        const cookie = await setCookie(res, gUser)
        if(!cookie){
            throw new Error(`Forbidden, or No access!`)
        }

        return res.status(200).json({gUser, cookie})

}
