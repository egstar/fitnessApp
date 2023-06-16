import crypto from 'crypto';
import { getSession, getUserById } from "@/models/Dashboard/Users/Users";
import { NextApiRequest, NextApiResponse } from "next";
import { uToken } from "../_app";
import { verifyPass } from "@/models/Dashboard/Users/Login";
import { updateImage, updatePassword } from "@/models/Dashboard/Users/Update";
import { UpdateInfo } from '@/models/Dashboard/Users/Update';
import * as env from "@/data/config";

export default async function handler(req:NextApiRequest, res:NextApiResponse){
    if(req.method != 'POST' && !req.cookies[uToken] && req.headers.origin !== env.WEBSITE){
        res.status(403).json({error:"Access is denied."})
    }
    const usrSession = await getSession(req.cookies[uToken]!)
    if(!usrSession){
        res.status(403).json({error:'Session has been expired, please relogin'})
    }
    const {uid,fname,lname,email,upass,newpass,img,newImage} = req.body 
    if(newImage){
        const uName = await updateImage(uid,img)
        if(!uName) res.status(403).json({error: 'Cannot update user image, please try again'})
        res.status(200).json({message: `${uName!.uname}'s image has been updated`})
    }
    
    if(fname || lname || email){
        const userInfo = await getUserById(uid)
        if(!userInfo) res.status(403).json({error:"Access is denied."})
        if(newpass){
            const vPass = await verifyPass(email,upass)
            if(!vPass) {res.status(403).json({error: 'Wrong password'})}
            const cryptoSalt = crypto.randomBytes(16).toString('hex')
            const npass = crypto.pbkdf2Sync(newpass, cryptoSalt, 1000, 64, 'sha512').toString('hex')
            const passEncrypt = npass+"b0rh4ms0l1m4n"+cryptoSalt
            const uName= await updatePassword(uid,passEncrypt)
            if(!uName) res.status(403).json({error:'Cannot update user info, please correct your info and try again'})
        }
        if(userInfo.fname == fname && userInfo.lname == lname && userInfo.email == email) {
            if(newpass) {
                res.status(200).json({message: 'Password has been changed'})
            } else {
                res.status(403).json({error: 'No thing to update'})
            }
        }
        if(userInfo.fname != fname || userInfo.lname != lname || userInfo.email != email) {
            const userUpdate = await UpdateInfo(uid,fname,lname,email)  as unknown as any
            if(userUpdate.severity == 'ERROR') {
                res.status(403).json({error: `${userUpdate.detail}`})
            } else {
                res.status(200).json({message: `User ${userInfo.uname} info has been updated`})
            }
        }
    }
}