import styles from '@/app/styles/profile.module.css'
import { useRef, useState } from 'react'
import * as BsIcons from 'react-icons/bs';
import * as FaIcons from 'react-icons/fa';
import { UserImage } from '../userImage';
export const Support = ({isUser}:any) => {
    
    const tickets = [
        {
            ticketsStates: {
                total: 5,
                open: 1,
                solved: 3,
                closed: 1
            },
            tickets: [
                {
                    id: 1,
                    desc: 'Ticket1',
                    status: 'open',
                    messages: [
                        {
                            sender: isUser.uname,
                            text:'I need help',
                            date: new Date()
                        },
                        {
                            sender: 'Support User',
                            text: 'OK',
                            date: new Date(Date.now() - 50)
                        },
                        {
                            sender: isUser.uname,
                            text:'My account is not working fine',
                            date: new Date()
                        }
                    ]
                },
                {
                    desc: 'Ticket2',
                    status: 'closed',
                    messages: [
                        {
                            sender: isUser.uname,
                            text:'Left the case',
                            date: new Date()
                        },
                        {
                            sender: 'Support User',
                            text: 'Case Closed Case Closed Case Closed Case Closed Case Closed Case Closed Case Closed Case Closed Case Closed Case Closed Case Closed Case Closed Case Closed Case Closed ',
                            date: new Date(Date.now() - 50)
                        }
                    ]
                },
                {
                    id: 2,
                    desc: 'Ticket3',
                    status: 'solved',
                    messages: [
                        {
                            sender: isUser.uname,
                            text:'fix it please',
                            date: new Date()
                        },
                        {
                            sender: 'Support User',
                            text: 'Done',
                            date: new Date(Date.now() - 50)
                        }
                    ]
                },
                {
                    id: 3,
                    desc: 'Ticket3',
                    status: 'solved',
                    messages: [
                        {
                            sender: isUser.uname,
                            text:'fix it please',
                            date: new Date()
                        },
                        {
                            sender: 'Support User',
                            text: 'Done',
                            date: new Date(Date.now() - 50)
                        }
                    ]
                },
                {
                    id: 4,
                    desc: 'reading panel the last ticket is overflown the width of panel ',
                    status: 'solved',
                    messages: [
                        {
                            sender: isUser.uname,
                            text:'fix it please',
                            date: new Date()
                        },
                        {
                            sender: 'Support User',
                            text: 'Done',
                            date: new Date(Date.now() - 50)
                        }
                    ]
                }
            ]
        }
    ]
    const [read, setRead] = useState() as any
    const readingPanel = useRef() as any
    function readMessages(e: any) {
        setRead({
            ticket: e.currentTarget.dataset.ticketid,
            desc: e.currentTarget.dataset.ticket,
            messages: tickets[0].tickets.filter((tk: any) => tk.id == e.currentTarget.dataset.ticketid).map((tk: any) => (tk.messages)),
            status: e.currentTarget.dataset.status
        })

    }
    function submitReply(e: any) {
        e.preventDefault()
    }
    return (
        <div className={`row g-0 ${styles.pagesContent}`} style={{height:'max-content'}}>
            <div className={`col-12`} style={{display:'flex',flexDirection:'row',}}>
                <div className={`${styles.pagesContainer} ${styles.ticketBoxes}`} style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                    <span><FaIcons.FaPlus style={{fontSize:'2rem',color:'white'}} /></span>
                </div>
                <div className={`${styles.pagesContainer} ${styles.ticketBoxes}`} style={{borderTop:'3px solid darkorange'}}>
                    <span>Open</span>
                    <span style={{height:'70%',display:'flex',justifyContent:'center',alignItems:'center',width:'100%',color:'darkorange',fontSize:'1.5rem'}}>{tickets[0].ticketsStates.open}</span>
                </div>
                <div className={`${styles.pagesContainer} ${styles.ticketBoxes}`} style={{borderTop:'3px solid maroon'}}>
                    <span>Closed</span>
                    <span style={{height:'70%',display:'flex',justifyContent:'center',alignItems:'center',width:'100%',color:'maroon',fontSize:'1.5rem'}}>{tickets[0].ticketsStates.closed}</span>
                </div>
                <div className={`${styles.pagesContainer} ${styles.ticketBoxes}`} style={{borderTop:'3px solid darkgreen'}}>
                    <span>Solved</span>
                    <span style={{height:'70%',display:'flex',justifyContent:'center',alignItems:'center',width:'100%',color:'darkgreen',fontSize:'1.5rem'}}>{tickets[0].ticketsStates.solved}</span>
                </div>
                <div className={`${styles.pagesContainer} ${styles.ticketBoxes}`} >
                    <span>Total</span>
                    <span style={{height:'70%',display:'flex',justifyContent:'center',alignItems:'center',width:'100%',color:'gray',fontSize:'1.5rem'}}>{tickets[0].ticketsStates.total}</span>
                </div>
            </div>
            <div className={`col-12 ${styles.supportData}`}>
                <div className={styles.pagesContainer_3} style={{height:'15rem'}}>
                    <span style={{position:'sticky',top:0,background:'lightgray',borderRadius:'12px 12px 0 0'}}>User Support tickets</span>
                    <ul className={styles.ticketsList} style={{overflowY:'auto',justifyContent:'flex-start'}}>
                        {
                            tickets[0].tickets.map((tk: any, index:number) => {
                                return(
                                    <li 
                                    onClick={readMessages} 
                                    className={`${styles.ticket} ${read && read.ticket == tk.id ? styles.currentTicket : null}`} 
                                    key={index}
                                    data-ticketid={tk.id}
                                    data-status={tk.status} 
                                    data-ticket={tk.desc}
                                    data-messages={tk.messages}
                                    >
                                        <div className={styles.ticketDetails}>
                                            <span className={`col-3 ${styles.ticketStatus}`} style={{background:`${tk.status == 'open' ? 'darkorange' : tk.status == 'solved' ? 'darkgreen' : 'maroon'}`}}>
                                                {tk.status}
                                            </span>
                                            <span className={`col-9 ${styles.ticketName}`} style={{paddingLeft:'.5rem',overflow:'hidden', textOverflow:'ellipsis',flexWrap:'nowrap',whiteSpace:'nowrap'}}>
                                                { tk.desc }
                                            </span>
                                        </div>
                                        <div className={styles.lastMessage}>
                                            {
                                                tk.messages.map((msg: any, index: any) => {
                                                    if(index == (tk.messages.length - 1))
                                                    
                                                    return (
                                                        <div key={index} className={`row g-0`}>
                                                            <div className={`col-9 ${styles.ticketLast}`}>Last reply: {msg.date.toLocaleString('en-UK')} </div>
                                                            <div className={`col-3 ${styles.ticketLastUser}`}>{msg.sender} </div>
                                                        </div>
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
                        Ticket's content
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
                                                return objects.map((msg: any, index: number) => {
                                                    return (
                                                        <div key={index} className={`row g-0 ${msg.sender == isUser.uname ? styles.messageSenderUser : styles.messageSenderSupport}`} style={{zIndex:999,color:'white',display:'flex',alignItems:'center'}}>
                                                            <div className={`col-3 row g-0 ${styles.msgUserInfo}`} style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent: 'center', flexWrap: 'nowrap' }}>
                                                                <div className={`col-12 ${styles.msgUserPic}`} >{ msg.sender == isUser.uname ? <UserImage isUser={isUser}  /> : <UserImage /> }</div>
                                                                <div className={`col-12 ${styles.msgUserName}`}><span>{msg.sender}</span></div>
                                                            </div>
                                                            <div className={`col-9 row g-0 ${styles.msgUserContent}`}>
                                                                <div className={`col-11 ${styles.msgText}`}>{msg.text}</div>
                                                                <div className={`col-12 ${styles.msgDate}`}>{msg.date.toLocaleString('en-UK')}</div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            })
                                        }
                                    </div>
                                    <div className={styles.ticketReply}>
                                        <form className={styles.supportForm} onSubmit={submitReply}>
                                            <textarea className={styles.replyBox} placeholder={'Type your message here'}rows={1} ></textarea>
                                            <button className={`btn btn-success`} type={'submit'} name={'submit'} ><BsIcons.BsSend /></button>
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