import * as env from '@/data/config'
import { getSession } from '@/models/Dashboard/Users/Users';
import { uToken } from '@/pages';
import { NextApiRequest, NextApiResponse } from "next";
import crypto from 'crypto';
import { updatePassword } from "@/models/Dashboard/Users/Update";



export default async function handler(req: NextApiRequest, res: NextApiResponse){
    // if(req.headers.origin != env.WEBSITE) res.status(400).json(`Access denied`)

    if(!req.cookies || !req.cookies![uToken]) res.status(403).json(`Access denied`)

    const isAdmin = await getSession(req.cookies[uToken]!)

    if(!isAdmin || (isAdmin && isAdmin.lid < 3)) res.status(300).json(`Only admins are premitted to do this action`)
    if(req.method == 'POST'){
        const {newpass,uid} = req.body
        const cryptoSalt = crypto.randomBytes(16).toString('hex')
        const npass = crypto.pbkdf2Sync(newpass, cryptoSalt, 1000, 64, 'sha512').toString('hex')
        const passEncrypt = npass+"b0rh4ms0l1m4n"+cryptoSalt
        const uName= await updatePassword(uid,passEncrypt)
        if(!uName) res.status(300).json({error: `Error changing user password`})
        res.status(200).json({message: `User ${uid} password has been changed`})
    } else {
        res.status(404).json({error: `Not found`})
    }
}