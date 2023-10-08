import styles from '@/app/styles/profile.module.css'
import { ErrorAlert } from '@/components/Error';
import { useEffect, useRef, useState } from 'react'
import * as BsIcons from 'react-icons/bs';
import * as FaIcons from 'react-icons/fa';
import { UserImage } from '../userImage';


const AdminSupport = ({isUser, setLoading, isLoading}: any) => {
    const [supportTickets, setSupportTickets] = useState({}) as any
    const [errorMessage, setErrorMessage ] = useState() as any
    const [dropDownTicket, setDropDownTicket] = useState() as any
    const [activeDropDown, setActiveDropDown] = useState() as any
    const [activeTicketBox, setActiveTicketBox] = useState() as any
    const [disabled, setDisabled] = useState(true)
    const sendButton = useRef() as any
    const [read, setRead] = useState() as any
    const [err, setError] = useState(false)
    const [newE, setNewE] = useState(false)
    const [ticket, updateTicket] = useState(0)
    const [filter, setFilter] = useState(0) as any
    const [chkTickets, setChkTickets] = useState(false)
    const ticketMsgs = useRef() as any
    const readingPanel = useRef() as any
    const rplyBox = useRef() as any
    const cpyToolTip = useRef() as any
    const optionsMenu = useRef() as any
    const supportRow = useRef() as any

    useEffect(() => {
        if(!errorMessage) setError(false)
    },[errorMessage])

    useEffect(() => {
        fetch('/api/admin/support', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                getUserTickets: true
            })
        }).then((res) => {
            if(res.status != 200) setError(true)
            return res.json()
        }).then((data) => {
            setSupportTickets(data)
        })
        setChkTickets(false)
        setLoading(false)
    },[ticket, filter, chkTickets])
    
    const openDropDown = (tid: any,e:any) => {
        if(activeDropDown != e.target || !e.target.classList.contains('activeDrop')){
            setDropDownTicket(tid)
            setActiveDropDown(e)
        } else {
            setDropDownTicket(null)
            setActiveDropDown(null)
        }
  
    }

    useEffect(() => {
        if(activeDropDown && optionsMenu) {
            window.addEventListener('mousedown', (e) =>{
                if(activeDropDown != e.target) {
                    setDropDownTicket(null)
                    setActiveDropDown(null)
                }
            })

        }
    
    },[dropDownTicket])
    

    const updateTickets = ({tid,uid,status}: any ) => {
        setLoading(true)
        fetch('/api/admin/support', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                ticketUpdate: {tid,uid,status}
            })
        }).then((res) => {
            if(res.status != 200) setError(true)
            return res.json()
        }).then((data)=> {
            if(err){
                setErrorMessage({msg:data.error,atype:'alert-danger'})
                setTimeout(() => setErrorMessage(), 5000)
            } else {
                setErrorMessage({msg:`Ticket has been moved to ${data.status == 0 ? 'Open' : data.status == 1 ? 'Closed' : 'Solved'}`,atype:'alert-success'})
                setTimeout(() => setErrorMessage(), 5000)
                setChkTickets(true)
            }
        })
    }
    const filterTickets = (e: any) => {
        setFilter(e.currentTarget.dataset.tickettype)
        setActiveTicketBox(null)
    }



    function readMessages(e: any) {
        setActiveTicketBox(e.currentTarget.dataset.tid)
        setRead({
            id: Number(e.currentTarget.dataset.tid),
            desc: e.currentTarget.dataset.desc,
            messages: Object.entries(supportTickets.utickets).filter((tk: any) => tk[1][0].id == e.currentTarget.dataset.tid).map((tk: any) => (tk[1][0].messages)),
            status: e.currentTarget.dataset.status
        })
    }
    useEffect(() => {
        if(read) ticketMsgs.current.scrollTop = Number(ticketMsgs.current.scrollHeight) + 100
    },[read])

    function submitReply(e: any) {
        e.preventDefault()
        setNewE(true)
        const currentTopic = {...read}
        fetch('/api/admin/support', {
            method:'POST',
            headers: {
                'Content-Type':'application/json'
            },
            credentials:'include',
            body: JSON.stringify({
                newMsg: {
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
            updateTickets({tid: read.id, uid: Number(isUser.uid), status:0})
            setRead(currentTopic)
            ticketMsgs.current.scrollTop = Number(ticketMsgs.current.scrollHeight) + 100
            setNewE(false)
        })
    }
    const newMessage = () => {
        rplyBox.current.value.length > 3 ? setDisabled(false) : setDisabled(true) 
    }
    const copyTicketId = () => {

        cpyToolTip.current.innerText = `Ticket ID ${read.id} copied`
        navigator.clipboard.writeText(read.id)
        setTimeout(()=> {
            cpyToolTip.current.innerText = 'Copy'
        },1000)
    }

    return (
        <div className={`${styles.pagesContent}`}>
            {
                errorMessage  && <ErrorAlert setShow={errorMessage ? true : false} msg={errorMessage!.msg} atype={errorMessage!.atype} />
            }
            <div className={`col-12`} style={{display:'flex',flexDirection:'row',}}>
                <div className={`${styles.pagesContainer} ${styles.ticketBoxes} ${ filter == 0 && styles.ticketBoxesActive}`} style={{borderTop:'3px solid darkorange'}} data-tickettype={0} onClick={filterTickets}>
                    <span>Open</span>
                    <span style={{height:'70%',display:'flex',justifyContent:'center',alignItems:'center',width:'100%',color:'darkorange',fontSize:'1.5rem'}}>{supportTickets && supportTickets.ticketsStates ? supportTickets.ticketsStates.open : 0}</span>
                </div>
                <div className={`${styles.pagesContainer} ${styles.ticketBoxes} ${filter && filter == 1 && styles.ticketBoxesActive}`} style={{borderTop:'3px solid maroon'}} data-tickettype={1} onClick={filterTickets}>
                    <span>Closed</span>
                    <span style={{height:'70%',display:'flex',justifyContent:'center',alignItems:'center',width:'100%',color:'maroon',fontSize:'1.5rem'}}>{supportTickets && supportTickets.ticketsStates ? supportTickets.ticketsStates.closed : 0}</span>
                </div>
                <div className={`${styles.pagesContainer} ${styles.ticketBoxes} ${filter && filter == 2 && styles.ticketBoxesActive}`} style={{borderTop:'3px solid darkgreen'}} data-tickettype={2} onClick={filterTickets}>
                    <span>Solved</span>
                    <span style={{height:'70%',display:'flex',justifyContent:'center',alignItems:'center',width:'100%',color:'darkgreen',fontSize:'1.5rem'}}>{supportTickets && supportTickets.ticketsStates ? supportTickets.ticketsStates.solved : 0}</span>
                </div>
                <div className={`${styles.pagesContainer} ${styles.ticketBoxes} ${filter && filter == 3 && styles.ticketBoxesActive}`} data-tickettype={3} onClick={filterTickets}>
                    <span>Total</span>
                    <span style={{height:'70%',display:'flex',justifyContent:'center',alignItems:'center',width:'100%',color:'gray',fontSize:'1.5rem'}}>{supportTickets && supportTickets.ticketsStates ? supportTickets.ticketsStates.total : 0}</span>
                </div>
            </div>
            <div className={styles.pagesContainer_1} style={{justifyContent:'flex-start',maxHeight:'50vmax',overflow:'auto'}}>
                <table className={` table table-sm table-hover table-secondary table-responsive table-striped ${styles.msgsTable}`}>
                    <thead className={styles.tableHead}>
                        <tr>
                        <th scope='col'>#</th>
                        <th scope='col'>Time</th>
                        <th scope='col'>Category</th>
                        <th scope='col' style={{width:'70%'}}>Message</th>
                        <th scope="col" style={{minWidth:'2.5rem'}}><BsIcons.BsGear /></th>
                        <th scope="col">Sender</th>
                        
                        </tr>
                    </thead>
                        {supportTickets && Object.entries(supportTickets).map((a: any,i: any) => {
                            return (
                                <tbody key={i}>
                                { a[0] === 'utickets' && Object.entries(a[1]).reverse().sort((a: any,b: any) => {return a[1][0].status - b[1][0].status}).map((a:any, b:any) => {

                                    if(filter == a[1][0].status || filter == 3)
                                    return (<tr ref={supportRow} key={b} style={{boxShadow:`${a[1][0].status == 0 ? '-3px 0px 0px orange' : a[1][0].status == 1 ? '-3px 0px 0px darkred' : '-3px 0px 0px green'}`}}>
                                            
                                            <th scope='col'>
                                                {a[0]}
                                            </th>
                                            <th scope='col' >
                                                { new Date(Object.entries(a[1][0].messages[a[1][0].messages.length -1]).map((a:any, b:any) => { return ( a[1].date  )}).toString()).toLocaleDateString('en-UK') }
                                            </th>
                                            <td style={{color: a[1][0].cat == 'Critical' ? 'red' : 'gray'}} >
                                                {a[1][0].cat}
                                            </td>
                                            <td className={styles.tableTitle} style={{textAlign:'left',textOverflow:'ellipsis ellipsis',overflow:'hidden',whiteSpace:'nowrap',maxWidth:'10rem'}} title={Object.entries(a[1][0].messages[0]).map((a:any, b:any) => { return ( a[1].message  )}) as any}>
                                            { a[1][0].new ? null : <FaIcons.FaCircle style={{fontSize:'.5rem', margin: 'auto .5rem',color:'green'}} />}<span className={styles.msgListTopic} style={{fontSize:'.75rem', color:'slateblue'}}>{a[1][0].desc} :</span> {Object.entries(a[1][0].messages[a[1][0].messages.length -1]).map((a:any, b:any) => { return ( a[1].message  )})}
                                            </td>
                                           
                                            <td ref={optionsMenu} style={{margin:'auto auto',padding:'0 .2rem',maxWidth:'fit-content'}}>
                                                <button className='btn btn-sm' onClick={(e) => openDropDown(a[0],e)}><FaIcons.FaAngleLeft /></button>
                                                <div className={`drop-down ${styles.dropDownOptions} ${dropDownTicket == a[0] && styles.activeDrop}`}>
                                                    <button className={`btn btn-sm  ${styles.msgsOptions}`} data-desc={a[1][0].desc} data-tid={a[0]} data-uid={a[1][0].uid} data-status={a[1][0].status} onClick={readMessages} disabled={a[1][0].status == 2 ? true : false}><BsIcons.BsChatQuote/></button>
                                                    <button className={`btn btn-sm  ${styles.msgsOptions}`} onClick={() => updateTickets({tid:a[0],uid:a[1][0].uid,status:2})} disabled={a[1][0].status == 2 ? true : false}><BsIcons.BsCheck2Circle /></button>
                                                    <button className={`btn btn-sm  ${styles.msgsOptions}`} onClick={() => updateTickets({tid:a[0],uid:a[1][0].uid,status:1})} disabled={a[1][0].status == 1 ? true : false}><BsIcons.BsFileLock2Fill /></button>
                                                    { isUser.lid > 3 ? <button className={`btn btn-sm  ${styles.msgsOptions}`} onClick={() => updateTickets({tid:a[0],uid:a[1][0].uid,status:0})}><BsIcons.BsTrash /></button> : null}
                                                </div>
                                            </td>
                                            <td style={{color:'#3697b8'}}>
                                                {Object.entries(a[1][0].messages[a[1][0].messages.length -1]).map((a:any, b:any) => { return ( a[1].sender  )})}
                                            </td>
                                        </tr>)
                                }) }
                                </tbody>
                                
                            )
                            
                        })}
               
                    
                </table>
            </div>

            {
                activeTicketBox 
                ? (
                    <div className={styles.pagesContainer_1} style={{height:'17rem',justifyContent:'flex-start',flexWrap:'nowrap'}}>
                    <div style={{position:'static',top:0,background:'lightgray',borderRadius:'12px 12px 0 0',width:'100%'}}>
                        Ticket&apos;s content
                    </div>
                    <div ref={readingPanel} className={styles.messageContent} style={{height:'100%'}}>
                        {
                            read 
                            ? (
                                <div className={styles.readingMessage} style={{height:'13.5rem'}}>
                                    <div className={styles.messageHead} style={{height:'1.5rem',textAlign:'left',margin:'auto auto',padding:'0 .75rem',textOverflow:'ellipsis',overflow:'hidden'}}>
                                        <span>Topic: <span style={{color:'black',fontSize:'.8rem'}}>{read.desc}</span></span>
                                        <span style={{position:'absolute', right:'0rem',top:'1.25rem'}}>
                                            { read.status == 0 ? <button className={`btn btn-sm`} onClick={() => updateTickets({tid:read.id,uid:isUser.uid,status:1})}><BsIcons.BsFileLock2 /></button> : null}
                                            { read.status < 2 ? <button className={`btn btn-sm`} onClick={() => updateTickets({tid:read.id,uid:isUser.uid,status:2})}><BsIcons.BsCheck2Circle className={`text-red`} /></button> : null}
                                        </span>
                                    </div>
                                    <div ref={ticketMsgs} className={styles.ticketMessages} style={{height:'9rem', border:'1px groove gray',width:'97%',margin:'auto auto',overflowY:'auto',borderRadius:'5px',display:'flex',flexWrap:'nowrap',flexDirection:'column',justifyContent:'flex-start',bottom:'0'}}>
                                        {
                                            read.messages.map((objects: any) => {
                                                return objects.map((rmsg: any, index: number) => {
                                                    return (
                                                        Object.entries(rmsg).map((msg:any,index:any) => {
                                                            return(
                                                                <div key={index} className={`row g-0 ${msg[1].sender == 'Support' ? styles.messageSenderUser : styles.messageSenderSupport}`} style={{zIndex:999,color:'white',display:'flex',alignItems:'center'}}>
                                                                    <div className={`col-3 row g-0 ${styles.msgUserInfo}`} style={{display:'flex',flexDirection:'column',alignItems:'flex-start',justifyContent: 'flex-start', flexWrap: 'nowrap' }}>
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
                                        {
                                            read.status < 2
                                            ? <form className={styles.supportForm} onSubmit={submitReply}>
                                                <textarea ref={rplyBox} className={styles.replyBox} placeholder={'Type your message here'} rows={1} onChange={newMessage}></textarea>
                                                <button className={`btn btn-sm btn-success`} type={'submit'} name={'submit'} ref={sendButton} disabled={disabled}>
                                                    <BsIcons.BsSend />
                                                </button>
                                            </form>
                                            : <div className=''>
                                                <span className=''>Ticket ID: 
                                                    <span className={`${styles.ticketIdField}`}>{read.id}</span>
                                                </span>
                                                <span className={`${styles.tooltip}`}>
                                                    <button className='btn btn-sm btn-outline-success' style={{fontSize:'.75rem'}} onClick={copyTicketId}>
                                                        <span className={`${styles.tooltipText}`} ref={cpyToolTip}>Copy</span>
                                                        <FaIcons.FaCopy />
                                                    </button>
                                                </span>
                                            </div>
                                        
                                        }

                                    </div>

                                </div>
                            )

                            : 'No message selected'
                        }
                    </div>
                </div>
                )
                : null
            }
        </div>
    )
}

export default AdminSupport;