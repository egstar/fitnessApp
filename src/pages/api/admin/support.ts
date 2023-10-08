import * as env from '@/data/config'
import { getAdminTickets, deleteTicket, sysReply, updateTicket, userReply, msgRead } from '@/models/Dashboard/Support';
import { getSession } from '@/models/Dashboard/Users/Users';
import { uToken } from '@/pages';
import { NextApiRequest, NextApiResponse } from "next";


export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<any> {
    if(req.method !== 'POST' && req.headers.origin !== env.WEBSITE) {
        res.status(400).json(`Access denied`)
    }
    const {getUserTickets,ticketUpdate,newMsg,tDestroy,readMsg} = req.body
    const userCookie = req.cookies![uToken]
    const userSession = await getSession(userCookie!)
    if(!userSession) res.status(400).json(`Access denied`)

    if(readMsg){
        const isRead = await msgRead(readMsg.tid,2)
        if(isRead.severity == 'ERROR') res.status(300).json(readMsg.error)
        res.status(200).json(isRead)
    }

    if(newMsg){
        const uReply = newMsg.uid ? await userReply(Number(newMsg.tid),Number(newMsg.uid),newMsg.msg) : await sysReply(Number(newMsg.tid),newMsg.msg)
        if(uReply.Error) res.status(300).json(uReply.error)
        res.status(200).json(uReply)
    }

    if(ticketUpdate){
        const tUpdate = await updateTicket(ticketUpdate.tid,ticketUpdate.uid,ticketUpdate.status)
        if(tUpdate.severity == 'ERROR') res.status(300).json(tUpdate.error)
        res.status(200).json(tUpdate)
    }

    if(tDestroy && userSession.lid > 2){
        const destroyTicket = await deleteTicket(tDestroy.tid)
        if(tDestroy.severity == 'ERROR') res.status(300).json(destroyTicket.error)
        res.status(200).json(destroyTicket)
    }

    if(getUserTickets){
        const userTickets = await getAdminTickets()
        if(userTickets.severity == 'ERROR') res.status(300).json(userTickets.error)
        if(userTickets.length > 0){
            const tickets = userTickets.reduce((ticket: any,vals: any) => {

                return ({
                    ...ticket, 
                    ticketsStates: {
                        open: vals.open,
                        closed: vals.closed,
                        solved: vals.solvd,
                        total: (Number(vals.open) + Number(vals.closed) + Number(vals.solvd)),
                    },
                    [vals.ticket_id] : [...(ticket[vals.ticket_id] || []), {[vals.id]:{id:vals.id,message:vals.message,sender:vals.sender,date:vals.tdate}}],
                    utickets: {...(ticket.utickets || []),
                        [vals.ticket_id]:[ ...(ticket['utickets'[vals.ticket_id]] || []),{
                            ['messages']: [...(ticket[vals.ticket_id] || []),{
                                [vals.id]: {
                                    id: vals.id,
                                    message: vals.message,
                                    sender: vals.sender,
                                    date: vals.tdate
                                }
                            }],
                            ['uid']: vals.uid,
                            ['status']: vals.status,
                            ['new']: vals.adminread,
                            ['cat']: vals.cat,
                            ['desc']: vals.topic,
                            ['id']: vals.ticket_id
                        }]
                    }
                })

            }, {})
            res.status(200).json(tickets)
        } else {
            res.status(203).json('Empty')
        }
    }
}