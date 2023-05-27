import { User } from "@/data/types";
import { createUser } from "@/models/Dashboard/Users/Signup";
import { NextApiRequest, NextApiResponse } from "next";
import crypto from 'crypto';
import { findUser } from "@/models/Dashboard/Users/Users";

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if(req.method === 'GET'){
        res.status(403).redirect('/signup')
    }
    if(req.method === 'POST'){
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
        throw new Error(`Password field is missing.`)
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
        await createUser(nUser)
        res.status(200).redirect('/')
    }
}