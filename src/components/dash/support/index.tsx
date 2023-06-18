import styles from '@/app/styles/profile.module.css'
import { useRef, useState } from 'react'
import * as BsIcons from 'react-icons/bs';
import * as FaIcons from 'react-icons/fa';
import { UserImage } from '../userImage';
export const Support = ({isUser}:any) => {
    const tickets = [
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
    const [read, setRead] = useState() as any
    const readingPanel = useRef() as any
    function readMessages(e: any) {
        setRead({
            ticket: e.currentTarget.dataset.ticketid,
            desc: e.currentTarget.dataset.ticket,
            messages: tickets.filter((tk: any) => tk.id == e.currentTarget.dataset.ticketid).map((tk: any) => (tk.messages)),
            status: e.currentTarget.dataset.status
        })

    }
    return (
        <div className={styles.pagesContent} style={{height:'max-content'}}>
            <div className={styles.pagesContent}>
                <span className={`${styles.pagesContainer} ${styles.ticketBoxes}`} style={{borderRadius:'5px',boxShadow:'0 1px 2px purple',height:'5vmax'}}>
                    Create new ticket
                </span>
                <span className={`${styles.pagesContainer} ${styles.ticketBoxes}`} style={{borderRadius:'5px',boxShadow:'0 1px 2px purple',height:'5vmax', color:'white', background:'darkorange'}}>
                    Open
                </span>
                <span className={`${styles.pagesContainer} ${styles.ticketBoxes}`} style={{borderRadius:'5px',boxShadow:'0 1px 2px purple',height:'5vmax', color:'white', background:'maroon'}}>
                    Closed
                </span>
                <span className={`${styles.pagesContainer} ${styles.ticketBoxes}`} style={{borderRadius:'5px',boxShadow:'0 1px 2px purple',height:'5vmax', color:'white', background:'darkgreen'}}>
                    Solved
                </span>
                <span className={`${styles.pagesContainer} ${styles.ticketBoxes}`} style={{borderRadius:'5px',boxShadow:'0 1px 2px purple',height:'5vmax'}}>
                    All tickets
                </span>
            </div>
            <div className={styles.pagesContent} style={{height:'15rem',width:'100%'}}>
                <div className={styles.pagesContainer_3} style={{height:'100%'}}>
                    <span style={{position:'sticky',top:0,background:'lightgray',borderRadius:'12px 12px 0 0'}}>User Support tickets</span>
                    <ul className={styles.ticketsList} style={{overflowY:'auto',justifyContent:'flex-start'}}>
                        {
                            tickets.map((tk: any, index:number) => {
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
                <div style={{position:'sticky',top:0,background:'lightgray',borderRadius:'12px 12px 0 0'}}>Ticket's content</div>
                <div ref={readingPanel} className={styles.messageContent} style={{height:'100%'}}>
                    {
                        read 
                        ? (
                            <div className={styles.readingMessage} style={{height:'calc(15rem - 1rem)'}}>
                                <div className={styles.messageHead} style={{height:'10%',textAlign:'left',marginLeft:'.5rem'}}>
                                    {read.desc}
                                </div>
                                <div className={styles.ticketMessages} style={{height:'60%', border:'1px solid lightgray',width:'97%',margin:'auto auto',overflowY:'auto'}}>
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
                                <div className={styles.ticketReply} style={{height:'20%'}}>
                                    <form className={styles.supportForm} style={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-around',height:'100%'}}>
                                    <textarea className={styles.replyBox} placeholder={'Type your message here'}rows={1} style={{width:'85%',fontSize:'1.25vmax', resize:'none',outline:'none', border:'none',boxShadow:'none',textIndent:'.5rem',textAnchor:'middle',borderRadius:'10px',height:'90%'}}></textarea>
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