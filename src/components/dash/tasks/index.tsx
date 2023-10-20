import styles from '@/app/styles/profile.module.css'
import {useState, useEffect} from 'react'

const Plans = ({setLoading,isLoading}: any) => {
const [plans, setPlans] = useState() as any
const [nullPlans, setNullPlans] = useState(false)

useEffect(() => {
    setNullPlans(true)
    fetch('/api/plans', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    }).then((res) =>{
        if(res.status == 200) return res.json()
    }).then((data) => {
        setPlans(data)
    })
    setNullPlans(false)
    setLoading(false)
},[nullPlans])
const leftTime = (newdate: any,startdate: any) => {
    if(new Date(startdate) > new Date()) return ''
    if(new Date(newdate) < new Date()) return 'Plan ended'
    var planEnds = Math.floor((new Date(new Date(newdate.toString())) as any - (new Date() as any)) / 1000 /  60 / 60 /24)

    var years = Math.floor(planEnds/365)
    var months = Math.floor((planEnds-(years*365))/30)
    var days = Math.floor(planEnds-(years*365)-(months*30))
    return `Left Years: ${years}, Months: ${months}, Days: ${days} `

}
if(!plans) return (<></>)

    return (
       <div className={styles.pagesContent}>
            <div className={styles.pagesContainer_1}>
                User Plans
            </div>
            
            <div className={`accordion overflow-auto ${styles.pagesContainer_1}`} id="userPlans">
                { 
                    plans 
                    ? plans.sort((a:any, b:any) => {
                        if(new Date(a.planStart) <= new Date() && new Date(a.planEnd) >= new Date() ){
                            return ((new Date(a.planStart) as any) - (new Date(b.planStart) as any))
                        } else {
                            if(new Date(a.planStart) >= new Date()){
                                return ((new Date(a.planEnd) as any) - (new Date(b.planEnd) as any))
                            } else if(new Date(a.planEnd) < new Date()){
                                return ((new Date(b.planEnd) as any) - (new Date(a.planEnd) as any))
                            }
                        }
                    }).map((pl: any,index: number) => {
                        return (
                            <div key={'plan'+pl.plan} className={`accordion-item ${styles.accordionElm}`} >
                                <div className="accordion-header" id={`userPlans-head${pl.plan.replaceAll(' ', '_')}`} style={{display:'flex',textAlign:'center',justifyContent:'center', alignItems:'center',width:'100%'}}>
                                    
                                    <button className="accordion-button" style={{fontSize: '1.7vw', height:'1rem',textAlign:'center'}} type="button" data-bs-toggle="collapse" data-bs-target={`#userPlans${pl.plan.replaceAll(' ', '_')}`} aria-expanded={index ==0 ? "true" : 'false'} aria-controls={`userPlans${pl.plan.replaceAll(' ', '_')}`}>
                                        <span className={`${styles.planPeriod}`} style={{position:'absolute', left:'70%',margin:'0 0',textAlign:'left', fontSize:'.8vmax',color:'lightslategray'}}>{leftTime(pl.planEnd,pl.planStart)}</span>
                                        <span className={`${styles.planActive}`} style={{background:`${new Date(pl.planEnd) < new Date() ? 'maroon' : new Date(pl.planStart) < new Date() ? 'darkgreen' : 'orange'}`}}>{new Date(pl.planEnd) < new Date(new Date(Date.now()+24*60*60*1000)) ? "Finished" : new Date(new Date(pl.planStart)) <= new Date(new Date(Date.now())) ? "Active" : "Not started"} </span>
                                        <span className={``} style={{position:'relative', left:'0',margin:'0 0',textAlign:'left',textOverflow:'ellipsis',overflow:'hidden',wordWrap:'normal'}}>{pl.plan + ' Plan'}</span>                                        
                                    </button>
                                </div>
                                <div id={`userPlans${pl.plan.replaceAll(' ', '_')}`} className={`accordion-collapse collapse ${index == 0 ? `show` : 'collapse'}`} aria-labelledby={`userPlans-head${pl.plan}`} style={{overflow:'auto'}} data-bs-parent="#userPlans">
                                    <div className={`accordion-body ${styles.accordionElmBody}`} style={{background:'#b69ca9',borderTop:'3px solid #583b63', overflow:'auto', maxHeight:'50vh',margin:0,padding:0}}>
                                        
                                        <table className={`table table-sm table-striped-columns overflow-auto ${styles.tableContainer}`} style={{overflow:'auto'}}>
                                        <thead className={`${styles.tableHead}`}>
                                            <tr>
                                                <th scope={`col`} colSpan={1}>Date</th>
                                                <th scope={`col`} colSpan={1}>Day</th>
                                                <th scope={`col`} colSpan={1}>∑ Days</th>
                                                {
                                                    pl.planStates.tasksDone
                                                    ? Object.entries(pl.planStates.tasksDone).map((tsk: any, index:number) => {
                                                        return (
                                                                <th key={index} scope={`col`} className={styles.taskElement}>
                                                                    {(tsk[0])}
                                                                </th>
                                                        )
                                                    })
                                                    : (<></>)
                                                }
                                            </tr>
                                            <tr>
                                                <th scope={`col`} colSpan={3}>% of goal gained</th>
                                                {
                                                    pl.planStates.tasksDone
                                                    ? Object.entries(pl.planStates.tasksDone).map((tsk: any, index:number) => {
                                                        return (
                                                                <th key={index} scope={`col`} className={styles.taskElement}>
                                                                    {((Number(tsk[1]) / Object.entries(pl.tasks).length) * 100).toFixed(2)}
                                                                </th>
                                                        )
                                                    })
                                                    : (<></>)
                                                }
                                            </tr>
                                            <tr>
                                                
                                                <th scope={`col`} colSpan={3}>Actual repetition</th>
                                                {
                                                    pl.planStates.tasksDone
                                                    ? Object.entries(pl.planStates.tasksDone).map((tsk: any, index:number) => {
                                                        return (
                                                                <th key={index} scope={`col`} className={styles.taskElement}>
                                                                    {(tsk[1])}
                                                                </th>
                                                        )
                                                    })
                                                    : (<></>)
                                                }
                                            </tr>
                                            <tr>
                                                
                                                <th scope={`col`} colSpan={3}>Targeted repetition</th>
                                                {
                                                    pl.planStates.tasksDone
                                                    ? Object.entries(pl.planStates.tasksDone).map((tsk: any, index:number) => {
                                                        return (
                                                                <th key={index} scope={`col`} className={styles.taskElement}>
                                                                    {((Object.entries(pl.tasks).length))}
                                                                </th>
                                                        )
                                                    })
                                                    : (<></>)
                                                }
                                            </tr>
                                        
                                        </thead>
                                        <tbody className={`${styles.tableBody}`}>
                                        {
                                            Object.entries(pl.tasks).map((tsk: any, index:number) => {
                                                const cDate = new Date(tsk[0])
                                                return (
                                                        <tr 
                                                        key={index} 
                                                        className={`
                                                                ${ cDate.toLocaleDateString('en-UK', {day: '2-digit',month:'2-digit',year:'numeric'}) == new Date(Date.now()).toLocaleDateString('en-UK', {day: '2-digit',month:'2-digit',year:'numeric'}) 
                                                                    ? styles.todayLine
                                                                    : null
                                                                }  
                                                            `}
                                                        id={`
                                                            ${cDate.toLocaleDateString('en-UK', {day: '2-digit',month:'2-digit',year:'numeric'}) == new Date(Date.now()).toLocaleDateString('en-UK', {day: '2-digit',month:'2-digit',year:'numeric'}) 
                                                                ? 'todaysline'
                                                                : pl.plan+'other'+index
                                                        }
                                                        `}
                                                        >
                                                        <th scope={`row`}>
                                                            {
                                                            cDate.toLocaleDateString('en-UK', {
                                                                day:'numeric',
                                                                month: '2-digit',
                                                                year: 'numeric'
        
                                                            })
                                                            }
                                                        </th>
                                                        <th scope={'row'}>
                                                        {
                                                            cDate.toLocaleDateString('en-UK', {
                                                                weekday: 'short'
        
                                                            })
                                                        }
                                                        </th>
                                                        <th scope={'row'}>
                                                            {
                                                                Object.entries(pl.tasks).length-index
                                                            }
                                                        </th>
                                                            {
                                                                Object.entries(tsk[1]).map((ztsk:any, index: number) => {
                                                                    return (
                                                                        Number(ztsk[1].tstatus) === 1
                                                                        ? new Date(ztsk[1].tdate).toLocaleDateString('en-UK', {day: '2-digit',month:'2-digit',year:'numeric'}) == new Date(Date.now() - 10800000).toLocaleDateString('en-UK', {day: '2-digit',month:'2-digit',year:'numeric'}) 
                                                                            ? <td key={index} style={{border:'1px solid orange'}}> X </td>
                                                                            : <td key={index} style={{background:'linear-gradient(45deg, lightgray, transparent, lightgray)'}}> X </td>
                                                                        : Number(ztsk[1].tstatus) === 0
                                                                            ? new Date(ztsk[1].tdate) > new Date(Date.now() - 10800000)
                                                                                ? <td key={index} className={styles.taskElement}>{ztsk[1].tname}</td>
                                                                                : new Date(ztsk[1].tdate).toLocaleDateString('en-UK', {day: '2-digit',month:'2-digit',year:'numeric'}) == new Date(Date.now()  - 10800000).toLocaleDateString('en-UK', {day: '2-digit',month:'2-digit',year:'numeric'}) 
                                                                                    ? <td key={index} style={{border:'1px solid orange'}}>{}</td>
                                                                                    : <td key={index} style={{background:'linear-gradient(45deg, #ff0000a5, #ff000055, #ff0000a5)', border:'1px solid darkred'}}>{}</td>
                                                                            : null
                                                                    )
                                                                })
                                                            }
                                                    </tr>
                                                )
                                            })
                                        }
                                        </tbody>
                                    </table>
                                        
                                    

                                    </div>
                                </div>
                            </div>
                            
                            
                            )
                        })
                    : (<div>No plans for this user</div>)
                }
            </div>
        </div>
    )
}

export default Plans;