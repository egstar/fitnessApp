import styles from '@/app/styles/profile.module.css'
import { useEffect, useState } from 'react'
import * as BsIcons from 'react-icons/bs';
import * as FaIcons from 'react-icons/fa';


const AdminSupport = ({isUser, setLoading, isLoading}: any) => {
    const [supportTickets, setSupportTickets] = useState({}) as any
    const [errorMessage, setErrorMessage ] = useState() as any
    const [err, setError] = useState(false)
    const getTicketsList = async() => {
        await fetch('/api/admin/support', {
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
    }
    useEffect(() => {
        getTicketsList()
    },[])
    return (
        <div className={`${styles.pagesContent}`}>
            <div className={`col-12`} style={{display:'flex',flexDirection:'row',}}>
                <div className={`${styles.pagesContainer} ${styles.ticketBoxes}`} style={{borderTop:'3px solid darkorange'}}>
                    <span>Open</span>
                    <span style={{height:'70%',display:'flex',justifyContent:'center',alignItems:'center',width:'100%',color:'darkorange',fontSize:'1.5rem'}}>{supportTickets && supportTickets.ticketsStates ? supportTickets.ticketsStates.open : 0}</span>
                </div>
                <div className={`${styles.pagesContainer} ${styles.ticketBoxes}`} style={{borderTop:'3px solid maroon'}}>
                    <span>Closed</span>
                    <span style={{height:'70%',display:'flex',justifyContent:'center',alignItems:'center',width:'100%',color:'maroon',fontSize:'1.5rem'}}>{supportTickets && supportTickets.ticketsStates ? supportTickets.ticketsStates.closed : 0}</span>
                </div>
                <div className={`${styles.pagesContainer} ${styles.ticketBoxes}`} style={{borderTop:'3px solid darkgreen'}}>
                    <span>Solved</span>
                    <span style={{height:'70%',display:'flex',justifyContent:'center',alignItems:'center',width:'100%',color:'darkgreen',fontSize:'1.5rem'}}>{supportTickets && supportTickets.ticketsStates ? supportTickets.ticketsStates.solved : 0}</span>
                </div>
                <div className={`${styles.pagesContainer} ${styles.ticketBoxes}`} >
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
                        <th scope="col">Sender</th>
                        <th scope="col" style={{width:'12%'}}><BsIcons.BsGear /></th>
                        </tr>
                    </thead>
                        {supportTickets && Object.entries(supportTickets).map((a: any,i: any) => {
                            return (
                                <tbody key={i}>
                                { a[0] === 'utickets' && Object.entries(a[1]).map((a:any, b:any) => {

                                    return (<tr key={b} >
                                            <th scope='col' >
                                                { new Date(Object.entries(a[1][0].messages[0]).map((a:any, b:any) => { return ( a[1].date  )}).toString()).toLocaleDateString('en-UK') }
                                            </th>
                                            <td >
                                                {a[1][0].cat}
                                            </td>
                                            <td className={styles.tableTitle} style={{textOverflow:'ellipsis ellipsis',overflow:'hidden',whiteSpace:'nowrap',maxWidth:'10rem'}} title={Object.entries(a[1][0].messages[0]).map((a:any, b:any) => { return ( a[1].message  )}) as any}>
                                                {Object.entries(a[1][0].messages[0]).map((a:any, b:any) => { return ( a[1].message  )})}
                                            </td>
                                            <td>
                                                {Object.entries(a[1][0].messages[0]).map((a:any, b:any) => { return ( a[1].sender  )})}
                                            </td>
                                            <th style={{margin:'auto auto',padding:'0 .2rem'}}>
                                                <button className={`btn btn-sm btn-warning ${styles.msgsOptions}`}><BsIcons.BsChatQuote/></button>  
                                                <button className={`btn btn-sm btn-success ${styles.msgsOptions}`}><BsIcons.BsCheck2Circle /></button>
                                                <button className={`btn btn-sm btn-primary ${styles.msgsOptions}`}><BsIcons.BsFileLock2Fill /></button>
                                            </th>
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