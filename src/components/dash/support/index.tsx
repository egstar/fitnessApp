import styles from '@/app/styles/profile.module.css'

export const Support = ({isUser}:any) => {
    const tickets = [
        {
            name: 'Ticket1',
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
            name: 'Ticket2',
            status: 'closed',
            messages: [
                {
                    sender: isUser.uname,
                    text:'Left the case',
                    date: new Date()
                },
                {
                    sender: 'Support User',
                    text: 'Case Closed',
                    date: new Date(Date.now() - 50)
                }
            ]
        },
        {
            name: 'Ticket3',
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
    return (
        <div className={styles.pagesContent}>
            <div className={styles.pagesContent}>
                <span className={styles.pagesContainer} style={{borderRadius:'5px',boxShadow:'0 1px 2px purple',height:'10rem'}}>
                    text
                </span>
                <span className={styles.pagesContainer} style={{borderRadius:'5px',boxShadow:'0 1px 2px purple',height:'10rem'}}>
                    text
                </span>
                <span className={styles.pagesContainer} style={{borderRadius:'5px',boxShadow:'0 1px 2px purple',height:'10rem'}}>
                    text
                </span>
                <span className={styles.pagesContainer} style={{borderRadius:'5px',boxShadow:'0 1px 2px purple',height:'10rem'}}>
                    text
                </span>
            </div>
            <div className={styles.pagesContainer_3}>
                User Support tickets
                <ul className={styles.ticketsList}>
                    {
                        tickets.map((tk: any, index:number) => {
                            return(
                                <li className={styles.ticket} key={index} data-status={tk.status}>
                                    <div className={styles.ticketDetails}>
                                        <span className={`col-3 ${styles.ticketStatus}`} style={{background:`${tk.status == 'open' ? 'darkorange' : tk.status == 'solved' ? 'darkgreen' : 'maroon'}`}}>
                                            {tk.status}
                                        </span>
                                        <span className={`col-9 ${styles.ticketName}`}>
                                            { tk.name }
                                        </span>
                                    </div>
                                    <div className={styles.lastMessage}>
                                        {
                                            tk.messages.map((msg: any, index: any) => {
                                                if(index == (tk.messages.length - 1))
                                                
                                                return (
                                                    <div className={`row g-0`}>
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
            <div className={styles.pagesContainerX3}>
                Box 1
            </div>
        </div>
    )
}