import styles from '@/app/styles/profile.module.css'
import { useEffect, useRef, useState } from 'react'
import * as BsIcons from 'react-icons/bs';
import * as FaIcons from 'react-icons/fa';
import { UserImage } from '../userImage';
import LoadingSpinner from '@/components/Loading';
export const Support = ({isUser}:any) => {
    
    const [tickets, setTickets] = useState() as any
    const [read, setRead] = useState() as any
    const [newE, setNewE] = useState(false)
    const [newTkt, setNewTicket] = useState() as any
    const readingPanel = useRef() as any
    const rplyBox = useRef() as any


    useEffect(() => {
        if(read && newE){
            
        }
        
        setNewE(false)
    },[newE])

    useEffect(() => {
        fetch('/api/support', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({getUserTickets: {uid: isUser.uid}})
        }).then((res) => res.json()).then((data) => {
            if(data.utickets) setTickets(data)
        })
        setNewTicket(false)
    },[newTkt])

    function readMessages(e: any) {
        setRead({
            id: Number(e.currentTarget.dataset.ticketid),
            desc: e.currentTarget.dataset.ticket,
            messages: Object.entries(tickets.utickets).filter((tk: any) => tk[1][0].id == e.currentTarget.dataset.ticketid).map((tk: any) => (tk[1][0].messages)),
            status: e.currentTarget.dataset.status
        })

    }
    function submitReply(e: any) {
        e.preventDefault()
        setNewE(true)
        const currentTopic = {...read}
        fetch('/api/support', {
            method:'POST',
            headers: {
                'Content-Type':'application/json'
            },
            credentials:'include',
            body: JSON.stringify({
                newMsg: {
                    uid: isUser.uid,
                    tid: read.id,
                    msg: rplyBox.current.value
                }
            })
        }).then((res) => {
            if(res.status != 200) return {error: res.json()}
            return res.json()
        }).then((data) => {
            if(data.error) console.log('error :', data.error)
            currentTopic.messages[0].push({[data.id]:{
                id: data.id,
                sender: data.sender,
                message: data.message,
                date: new Date(data.tdate)
            }})
            setRead(currentTopic)
            setNewE(false)
        })
    }

    function submitNewTicket(e: any){
        e.preventDefault()
        const ticketData = new FormData(e.currentTarget)
        const newTicket = {
            uid: isUser.uid,
            desc: ticketData.get('desc'),
            msg: ticketData.get('msg'),
            cat: ticketData.get('cat'),
        }
        fetch('/api/support', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
            },
            credentials:'include',
            body: JSON.stringify({newTicket: newTicket})
        }).then((res) => {
            if(res.status != 200) return {error: res.json()}
            return res.json()
        }).then((data) => {
            if(data.error) console.log('error: ',data.error)
            setNewTicket(true)
        })
    }
    return (
        <div className={`row g-0 ${styles.pagesContent}`} style={{height:'max-content'}}>
            
            <div className={`modal fade}`} id="cnewticket" tabIndex={-1} aria-labelledby="newticketmodal" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className={`${styles.newTicketModalHeader}`}>
                                Support Request
                            </div>
                            <div className={`${styles.tkModal}`}>
                                <form id='submitnewticket' onSubmit={submitNewTicket}>
                                    <div className="form-floating mb-3">
                                        <input type="text" className="form-control" name="desc" id="desc" placeholder="Topic" required style={{background:'darkgray',boxShadow:'none',border:'none',outline:'none'}}/>
                                        <label htmlFor="desc">Topic</label>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <select className="form-select form-select-sm" defaultValue={0} aria-label=".form-select-sm cat" name="cat" id="cat" placeholder="Categorey" required  style={{color:'#583b63',boxShadow:'none',border:'none',outline:'none'}}>
                                            <option value={0} disabled>Select Categorey</option>
                                            <option>General</option>
                                            <option>Critical</option>
                                            <option>Other</option>
                                        </select>
                                        <label htmlFor="cat" style={{color:'black'}}>Categorey</label>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <textarea className={`form-control ${styles.newTicketAreaBox}`} name="msg" id="msg" placeholder="Your message" rows={3} required style={{height:'8rem',background:'darkgray',resize:'none'}}/>
                                        <label className={`${styles.msgDescription}`} htmlFor="msg">Describe your issue</label>
                                    </div>
                                    <div className={`input-group`}>
                                        <input className={`form-control btn btn-success`} type='submit' name='submit' value='Create ticket' />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`col-12`} style={{display:'flex',flexDirection:'row',}}>
                <div className={`${styles.pagesContainer} ${styles.ticketBoxes} ${styles.newTicket}`} style={{display:'flex',justifyContent:'center',alignItems:'center'}} data-bs-toggle="modal" data-bs-target="#cnewticket">
                    <span><FaIcons.FaPlus style={{fontSize:'2rem',color:'white'}} /></span>
                </div>
                <div className={`${styles.pagesContainer} ${styles.ticketBoxes}`} style={{borderTop:'3px solid darkorange'}}>
                    <span>Open</span>
                    <span style={{height:'70%',display:'flex',justifyContent:'center',alignItems:'center',width:'100%',color:'darkorange',fontSize:'1.5rem'}}>{tickets && tickets.ticketsStates ? tickets.ticketsStates.open : 0}</span>
                </div>
                <div className={`${styles.pagesContainer} ${styles.ticketBoxes}`} style={{borderTop:'3px solid maroon'}}>
                    <span>Closed</span>
                    <span style={{height:'70%',display:'flex',justifyContent:'center',alignItems:'center',width:'100%',color:'maroon',fontSize:'1.5rem'}}>{tickets && tickets.ticketsStates ? tickets.ticketsStates.closed : 0}</span>
                </div>
                <div className={`${styles.pagesContainer} ${styles.ticketBoxes}`} style={{borderTop:'3px solid darkgreen'}}>
                    <span>Solved</span>
                    <span style={{height:'70%',display:'flex',justifyContent:'center',alignItems:'center',width:'100%',color:'darkgreen',fontSize:'1.5rem'}}>{tickets && tickets.ticketsStates ? tickets.ticketsStates.solved : 0}</span>
                </div>
                <div className={`${styles.pagesContainer} ${styles.ticketBoxes}`} >
                    <span>Total</span>
                    <span style={{height:'70%',display:'flex',justifyContent:'center',alignItems:'center',width:'100%',color:'gray',fontSize:'1.5rem'}}>{tickets && tickets.ticketsStates ? tickets.ticketsStates.total : 0}</span>
                </div>
            </div>
            <div className={`col-12 ${styles.supportData}`}>
                <div className={styles.pagesContainer_3} style={{height:'15rem',justifyContent:'flex-start'}}>
                    <span style={{position:'sticky',top:0,background:'lightgray',borderRadius:'12px 12px 0 0'}}>User Support tickets</span>
                    <ul className={styles.ticketsList}>
                        {
                            tickets && Object.entries(tickets.utickets).map((tickeet: any, index:number) => {
                                let tk= tickeet[1][0]
                                
                                return(
                                    <li 
                                    onClick={readMessages} 
                                    className={`${styles.ticket} ${read && read.id == tk.id ? styles.currentTicket : null}`} 
                                    key={index}
                                    data-ticketid={tk.id}
                                    data-status={tk.status} 
                                    data-ticket={tk.desc}
                                    data-messages={tk.messages}
                                    >
                                        <div className={styles.ticketDetails}>
                                            <span className={`col-3 ${styles.ticketStatus}`} style={{background:`${tk.status == 0 ? 'darkorange' : tk.status == 2 ? 'darkgreen' : 'maroon'}`}}>
                                                {tk.status == 0 ? 'open' : tk.status == 1 ? 'closed' : 'solved'}
                                            </span>
                                            <span className={`col-9 ${styles.ticketName}`} style={{paddingLeft:'.5rem',overflow:'hidden', textOverflow:'ellipsis',flexWrap:'nowrap',whiteSpace:'nowrap'}}>
                                                { tk.desc }
                                            </span>
                                        </div>
                                        <div className={styles.lastMessage}>
                                            {
                                                tk.messages.map((rmsg: any, index: any) => {
                                                    if(index == (tk.messages.length - 1))
                                                        return (Object.entries(rmsg).map((msg: any) => {
                                                            return (
                                                                <div key={index} className={`row g-0`}>
                                                                    <div className={`col-9 ${styles.ticketLast}`}>Last reply: {msg[1].date && new Date(msg[1].date).toLocaleString('en-UK')} </div>
                                                                    <div className={`col-3 ${styles.ticketLastUser}`}>{msg[1].sender} </div>
                                                                </div>
                                                            )
                                                        })
                                                    )
                                                })
                                            }
                                        </div>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
                <div className={styles.pagesContainerX3} style={{height:'15rem',justifyContent:'flex-start'}}>
                    <div style={{position:'static',top:0,background:'lightgray',borderRadius:'12px 12px 0 0'}}>
                        Ticket&apos;s content
                    </div>
                    <div ref={readingPanel} className={styles.messageContent} style={{height:'100%'}}>
                        {
                            read 
                            ? (
                                <div className={styles.readingMessage} style={{height:'13.5rem'}}>
                                    <div className={styles.messageHead} style={{height:'1.5rem',textAlign:'left',margin:'auto auto',padding:'0 .75rem',textOverflow:'ellipsis',overflow:'hidden'}}>
                                        Topic: <span style={{color:'black',fontSize:'.8rem'}}>{read.desc}</span>
                                    </div>
                                    <div className={styles.ticketMessages} style={{height:'9rem', border:'1px groove lightgray',width:'97%',margin:'auto auto',overflowY:'auto'}}>
                                        {
                                            read.messages.map((objects: any) => {
                                                return objects.map((rmsg: any, index: number) => {
                                                    return (
                                                        Object.entries(rmsg).map((msg:any,index:any) => {
                                                            return(
                                                                <div key={index} className={`row g-0 ${msg[1].sender == isUser.uname ? styles.messageSenderUser : styles.messageSenderSupport}`} style={{zIndex:999,color:'white',display:'flex',alignItems:'center'}}>
                                                                    <div className={`col-3 row g-0 ${styles.msgUserInfo}`} style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent: 'center', flexWrap: 'nowrap' }}>
                                                                        <div className={`col-12 ${styles.msgUserPic}`} >{ msg[1].sender == isUser.uname ? <UserImage isUser={isUser}  /> : <UserImage /> }</div>
                                                                        <div className={`col-12 ${styles.msgUserName}`}><span>{msg[1].sender}</span></div>
                                                                    </div>
                                                                    <div className={`col-9 row g-0 ${styles.msgUserContent}`}>
                                                                        <div className={`col-11 ${styles.msgText}`}>{msg[1].message}</div>
                                                                        <div className={`col-12 ${styles.msgDate}`}>{new Date(msg[1].date).toLocaleString('en-UK')}</div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                    )
                                                })
                                            })
                                        }
                                    </div>
                                    <div className={styles.ticketReply}>
                                        <form className={styles.supportForm} onSubmit={submitReply}>
                                            <textarea ref={rplyBox} className={styles.replyBox} placeholder={'Type your message here'}rows={1} disabled={newE}></textarea>
                                            <button className={`btn btn-success`} type={'submit'} name={'submit'} disabled={newE} ><BsIcons.BsSend /></button>
                                        </form>

                                    </div>

                                </div>
                            )

                            : 'No message selected'
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}