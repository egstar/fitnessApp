import Iron from '@hapi/iron'
import crypto from 'crypto';
import * as Config from '@/data/config'
import { serialize, parse  } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";
import { User } from "@/data/types";
import { getPass, getSession, setSession, unsetSession } from './Users';
import { uToken } from "@/data/config";


const jwtToken = Config.JWT_SECRET
export const setCookie = async(res:NextApiResponse, gUser: User): Promise<string> => {
    const cookie = await createCookie(gUser)
    
    return cookie
}
export const createCookie = async(gUser: User): Promise<any> => {
    const sissue: number = Date.now()
    const mxAge: number = 60 * 60 * 24
    const obj = {...gUser, sissue, mxAge}
    const token = await Iron.seal(obj, jwtToken!, Iron.defaults)
    const cookie = serialize(uToken, token, {
        maxAge: mxAge,
        expires: new Date(Date.now() + mxAge * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'development',
        path: '/',
        sameSite: 'lax',
    })
    await unsetSession(gUser.id!)
    await setSession(token, gUser.id!, gUser.lid!)
    await parse(cookie || '')
    return cookie
}

export const parseCookies = async(req: NextApiRequest) => {
    if (req.cookies && req.cookies[uToken]) {
        const reqToken = req.cookies[uToken]!
        const currentSession = await getSession(reqToken)
        if(currentSession) return req.cookies
    }
    const cookie = req.headers?.cookie
    return parse(cookie || '')
}

export const getCookie = async(req: NextApiRequest) => {
    const cookies = await parseCookies(req)
    return cookies[uToken]
}

export const unsetCookie = async(req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    const c0k = req.cookies[uToken]
    const currentCookie = await getSession(c0k!)
    if(currentCookie){
        const cCookie = await getCookie(req)
        const unseal = await Iron.unseal(cCookie!, jwtToken!, Iron.defaults)
        await unsetSession(unseal.id)
    }
    const cookie = serialize(uToken, '', {
        maxAge: -1,
        path: '/',
    })

    res.setHeader('Set-Cookie', cookie)
}

export const verifyPass = async(user: string, upass: string): Promise<boolean> => {
    const gUser: string = await getPass(user)
    const salt: string = gUser.split('b0rh4ms0l1m4n')[1] ? gUser.split('b0rh4ms0l1m4n')[1] : Config.BCRYPT_SECRET!
    const savedPass: string = gUser ? gUser.split('b0rh4ms0l1m4n')[0] : gUser
    const hashPass = crypto.pbkdf2Sync(upass, salt, 1000, 64, 'sha512').toString('hex')

    return savedPass === hashPass
}