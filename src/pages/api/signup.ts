import { User } from "@/data/types";
import { createUser } from "@/models/Dashboard/Users/Signup";
import { NextApiRequest, NextApiResponse } from "next";
import crypto from 'crypto';
import { findUser } from "@/models/Dashboard/Users/Users";
import * as env from '@/data/config'

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<any> {
    if(req.method === 'GET'){
        res.status(403).redirect('/signup')
    }
    if(req.method === 'POST' && req.headers.origin === env.WEBSITE!){
        const {uname, fname, lname, email, userpass} = req.body
        const fUser = await findUser(uname)
        if(fUser){
            return(
                res.status(403).json({
                    done: false,
                    userId: 0
                })
            )
            
        }
        const cryptoSalt = crypto.randomBytes(16).toString('hex')
        if(!userpass) {
            res.status(400).json({error:`Password field is missing.`})
        }
        if(!fname){
            res.status(400).json({error:`Firstname field is missing.`})
        }
        if(!lname){
            res.status(400).json({error:`Lastname field is missing.`})
        }
        if(!uname){
            res.status(400).json({error:`Username field is missing.`})
        }
        if(!email){
            res.status(400).json({error:`Email address field is missing.`})
        }
        const upass = crypto.pbkdf2Sync(userpass, cryptoSalt, 1000, 64, 'sha512').toString('hex')
        const passEncrypt = upass+"b0rh4ms0l1m4n"+cryptoSalt
        const nUser: User = {
            uname,
            fname,
            lname,
            email,
            passwd: passEncrypt,
        }
        const newUser = await createUser(nUser)
        if(newUser.severity == 'ERROR') {
            res.status(403).json({error: `${newUser.detail}`})
        } else {
            res.status(200).json({message: `User has been created successfully.`})
        }
    }
}