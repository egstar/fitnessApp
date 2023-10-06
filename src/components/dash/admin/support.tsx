import styles from '@/app/styles/profile.module.css'
import { useEffect, useRef, useState } from 'react'
import * as BsIcons from 'react-icons/bs';
import * as FaIcons from 'react-icons/fa';


const AdminSupport = ({isUser, setLoading, isLoading}: any) => {
    const [supportTickets, setSupportTickets] = useState({}) as any
    const [errorMessage, setErrorMessage ] = useState() as any
    const [dropDownTicket, setDropDownTicket] = useState() as any
    const [activeDropDown, setActiveDropDown] = useState() as any
    const [err, setError] = useState(false)
    const [ticket, updateTicket] = useState(0)
    const optionsMenu = useRef() as any

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
    },[ticket])
    
    const openDropDown = (tid: any,e:any) => {
        if(activeDropDown != e.target || !e.target.classList.contains('Active')){
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
        fetch('/api/support', {
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
        }).then((data) => {
            updateTicket(status)
        })
    }
    const filterTickets = (e: any) => {
        updateTicket(e.currentTarget.dataset.tickettype)
    }


    return (
        <div className={`${styles.pagesContent}`}>
            <div className={`col-12`} style={{display:'flex',flexDirection:'row',}}>
                <div className={`${styles.pagesContainer} ${styles.ticketBoxes} ${ ticket == 0 && styles.ticketBoxesActive}`} style={{borderTop:'3px solid darkorange'}} data-tickettype={0} onClick={filterTickets}>
                    <span>Open</span>
                    <span style={{height:'70%',display:'flex',justifyContent:'center',alignItems:'center',width:'100%',color:'darkorange',fontSize:'1.5rem'}}>{supportTickets && supportTickets.ticketsStates ? supportTickets.ticketsStates.open : 0}</span>
                </div>
                <div className={`${styles.pagesContainer} ${styles.ticketBoxes} ${ticket && ticket == 1 && styles.ticketBoxesActive}`} style={{borderTop:'3px solid maroon'}} data-tickettype={1} onClick={filterTickets}>
                    <span>Closed</span>
                    <span style={{height:'70%',display:'flex',justifyContent:'center',alignItems:'center',width:'100%',color:'maroon',fontSize:'1.5rem'}}>{supportTickets && supportTickets.ticketsStates ? supportTickets.ticketsStates.closed : 0}</span>
                </div>
                <div className={`${styles.pagesContainer} ${styles.ticketBoxes} ${ticket && ticket == 2 && styles.ticketBoxesActive}`} style={{borderTop:'3px solid darkgreen'}} data-tickettype={2} onClick={filterTickets}>
                    <span>Solved</span>
                    <span style={{height:'70%',display:'flex',justifyContent:'center',alignItems:'center',width:'100%',color:'darkgreen',fontSize:'1.5rem'}}>{supportTickets && supportTickets.ticketsStates ? supportTickets.ticketsStates.solved : 0}</span>
                </div>
                <div className={`${styles.pagesContainer} ${styles.ticketBoxes} ${ticket && ticket == 3 && styles.ticketBoxesActive}`} data-tickettype={3} onClick={filterTickets}>
                    <span>Total</span>
                    <span style={{height:'70%',display:'flex',justifyContent:'center',alignItems:'center',width:'100%',color:'gray',fontSize:'1.5rem'}}>{supportTickets && supportTickets.ticketsStates ? supportTickets.ticketsStates.total : 0}</span>
                </div>
            </div>
            <div className={styles.pagesContainer_1} style={{justifyContent:'flex-start',maxHeight:'50vmax',overflow:'auto'}}>
                <table className={` table table-sm table-hover table-secondary table-responsive table-striped ${styles.msgsTable}`}>
                    <thead className={styles.tableHead}>
                        <tr>
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
                                { a[0] === 'utickets' && Object.entries(a[1]).sort((a: any,b: any) => {return a[1][0].status - b[1][0].status}).map((a:any, b:any) => {
                                    if(ticket == a[1][0].status || ticket == 3)
                                    
                                    return (<tr key={b} style={{boxShadow:`${a[1][0].status == 0 ? '-3px 0px 0px orange' : a[1][0].status == 1 ? '-3px 0px 0px darkred' : '-3px 0px 0px green'}`}}>
                                            <th scope='col' >
                                                { new Date(Object.entries(a[1][0].messages[0]).map((a:any, b:any) => { return ( a[1].date  )}).toString()).toLocaleDateString('en-UK') }
                                            </th>
                                            <td style={{color: a[1][0].cat == 'Critical' ? 'red' : 'gray'}} >
                                                {a[1][0].cat}
                                            </td>
                                            <td className={styles.tableTitle} style={{textOverflow:'ellipsis ellipsis',overflow:'hidden',whiteSpace:'nowrap',maxWidth:'10rem'}} title={Object.entries(a[1][0].messages[0]).map((a:any, b:any) => { return ( a[1].message  )}) as any}>
                                                {Object.entries(a[1][0].messages[0]).map((a:any, b:any) => { return ( a[1].message  )})}
                                            </td>
                                           
                                            <td ref={optionsMenu} style={{margin:'auto auto',padding:'0 .2rem',maxWidth:'fit-content'}}>
                                                <button className='btn btn-sm' onClick={(e) => openDropDown(a[0],e)}><FaIcons.FaAngleLeft /></button>
                                                <div className={`drop-down ${styles.dropDownOptions} ${dropDownTicket == a[0] && styles.activeDrop}`}>
                                                    <button className={`btn btn-sm  ${styles.msgsOptions}`} data-tid={a[0]} data-uid={a[1][0].uid} data-status={a[1][0].status}><BsIcons.BsChatQuote/></button>
                                                    <button className={`btn btn-sm  ${styles.msgsOptions}`} onClick={() => updateTickets({tid:a[0],uid:a[1][0].uid,status:2})}><BsIcons.BsCheck2Circle /></button>
                                                    <button className={`btn btn-sm  ${styles.msgsOptions}`} onClick={() => updateTickets({tid:a[0],uid:a[1][0].uid,status:1})}><BsIcons.BsFileLock2Fill /></button>
                                                    { isUser.lid > 3 ? <button className={`btn btn-sm  ${styles.msgsOptions}`} onClick={() => updateTickets({tid:a[0],uid:a[1][0].uid,status:1})}><BsIcons.BsTrash /></button> : null}
                                                </div>
                                            </td>
                                            <td style={{color:'#3697b8'}}>
                                                {Object.entries(a[1][0].messages[0]).map((a:any, b:any) => { return ( a[1].sender  )})}
                                            </td>
                                        </tr>)
                                }) }
                                </tbody>
                                
                            )
                            
                        })}
               
                    
                </table>
            </div>
        </div>
    )
}

export default AdminSupport;