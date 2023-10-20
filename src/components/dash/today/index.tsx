import styles from '@/app/styles/profile.module.css'
import { useState, useEffect } from 'react';
import * as BsIcons from 'react-icons/bs';
import * as FaIcons from 'react-icons/fa';


const Today = ({setLoading,isLoading}:any) => {
    let currentTime = new Date()
    
    const [data, setData] = useState() as any
    
    
    const handleTask = (e: any,tsk: any) => {
        e.preventDefault();
        let eCls: string[] = e.currentTarget.classList
        let checkeed: boolean = false
        let disabled: boolean = false

        const undoneTask = async() => { 
            const oldData = data
            const thisTask = data.map((dt:any) => {
                if(dt.pid == tsk.pid){
                    const ztasks = dt.tsks.map((task:any) => {
                        if(Number(task.tid) == tsk.tid){
                            e.currentTarget.classList.remove(styles.taskBoxChecked)
                            return {...task, tstatus: 0}
                        }
                        return task
                    })
                    return {...dt, ftsks: Number(dt.ftsks)-1, tsks: ztasks }
                }
                return dt
            })
            setData(thisTask)
            await fetch('/api/tasks/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    pid: tsk.pid,
                    tid: tsk.tid,
                    uid: tsk.uid,
                    tupdate: 'undone'
                })
            }).then((res) => {
                if(res.status === 200){
                    return res.json()
                } else {
                    setData(oldData)
                }
            })
        }
        const doneTask = async() => { 
            const oldData = data
            const thisTask = data.map((dt:any) => {
                if(dt.pid == tsk.pid){
                    const ztasks = dt.tsks.map((task:any) => {
                        if(Number(task.tid) == tsk.tid){
                            e.currentTarget.classList.add(styles.taskBoxChecked)
                            return {...task, tstatus: 1}
                        }
                        return task
                    })
                    return {...dt, ftsks: Number(dt.ftsks)+1, tsks: ztasks }
                }
                return dt
            })
            setData(thisTask)
            await fetch('/api/tasks/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    pid: tsk.pid,
                    tid: tsk.tid,
                    uid: tsk.uid,
                    tupdate: 'done'
                })
            }).then((res) => {
                if(res.status === 200){
                    return res.json()
                } else {
                    setData(oldData)
                }
            })
        }
        eCls.forEach((cls: string) => {
            if(cls == styles.taskDisabled) disabled = true

            if(cls == styles.taskBoxChecked) checkeed = true
        })
        
        disabled 
        ? null
        : checkeed
            ? confirm("Do you want to reset this task?") == true
                ?  undoneTask()
                : null
            : doneTask()
        
    }

    useEffect(() => {
        setLoading(true)
        fetch('/api/tasks/today', {
            method: 'POST',
            credentials: 'include'
        })
          .then((res) => {
            if(res.status == 200){
              return  res.json()
            }
            return null })
          .then((dt) => {
            if(dt && dt.length != 0){
                const plans: {} = dt.reduce((plans: any,tasks: any) => ({
                    ...plans,
                    [tasks.pname]: [...(plans[tasks.pname] || []), tasks]
                }), {})
                let entries: any = [];
                Object.entries(plans).map(([pln,tsks]: any) => {
                    let b = 0;
                    tsks.filter((tsk:any) => tsk.tstatus == 1).forEach(() => { b = b+1 })
                    entries.push({pname: pln, pid: Number(tsks[0].pid), ftsks: b, tsks: tsks})
                })
                setData(entries)
            } else {
                setData(null)
            }
          })
          setLoading(false)
      }, [])


    
    // if (!isLoading && !data) return <div className={`${styles.errorPage}`}><p className={`${styles.errorMessage}`}> <br /> Error!, Page isn't loading, please refresh the page or contact site admins</p></div>
    const taskDay = new Date(Date.now())
    
    return(
        <div className={styles.pagesContent}>
            <div className={styles.pagesContainer_1}>
                Tasks of { taskDay.toLocaleDateString('en-uk', {
                    weekday: "long",
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                }) }
            </div>
            <div className={`accordion ${styles.pagesContainer_1}`} id="userPlans">
            {
                data
                ? data.map((pln: any, index: number) => {
                    const tskPercentage: number = parseFloat((Number(pln.ftsks) / (Number(pln.tsks.length)) * 100).toFixed(2));
                    return (
                    <div key={pln.pid} className={`accordion-item`}>
                        <h2 className="accordion-header" id={`userPlans-head${pln.pid}`} style={{textAlign:'center'}}>
                        <button className="accordion-button" type="button" style={{boxShadow:'none',fontSize: '1.7vw', height:'1rem',width:'100%',textAlign:'center'}} data-bs-toggle="collapse" data-bs-target={`#userPlans${pln.pid}`} aria-expanded="true" aria-controls={`userPlans${pln.pid}`}>
                            <span style={{padding:'0 .5rem',color:'purple'}}><BsIcons.BsFan /> </span>
                            <span  style={{fontSize: '1.9vw',textAlign:'left'}}>{pln.pname + ' Plan'}</span>
                            <span className={`${styles.tasksPercentage}`} style={{position:'absolute', right:'3rem',margin:'0 0',textAlign:'left', fontSize:'.9vmax',color:'lightslategray'}}>{tskPercentage} %</span>
                        </button>
                        </h2>
                        <div id={`userPlans${pln.pid}`} className={`accordion-collapse collapse ${index == 0 ? 'show' : null}`} aria-labelledby={`userPlans-head${pln.pid}`} data-bs-parent="#userPlans">
                            <div className={`accordion-body`} style={{background:'#b69ca9',borderTop:'3px solid #583b63'}}>
                                <div className={`${styles.TodayTasks}`}>
                                {
                                    pln.tsks.map((tsk: any) => {
                                        return (
                                            <a key={tsk.tid} onClick={(e) => handleTask(e,tsk)} href={`#${tsk.tid}`} className={`${styles.tasksLink} ${styles.taskBox} ${
                                                tsk.tid == 1 
                                                ? tsk.tstatus == 1
                                                    ? styles.taskBoxChecked 
                                                    : currentTime.getHours() > 9
                                                        ? styles.taskDisabled 
                                                        : styles.taskBox 
                                                : tsk.tstatus == 1
                                                    ? styles.taskBoxChecked 
                                                    : styles.taskBox} `}>
                                                <div className={styles.taskHead}>
                                                    <div className={styles.taskTitle}>
                                                        <div className={styles.todayTask}>{tsk.tname}</div>
                                                    </div>
                                                </div>
                                                <div className={styles.taskTail}>
                                                    <p style={{marginBottom: '0',marginTop: '0'}}>{tsk.dsc}</p>
                                                </div>
                                            </a>
                                        )
                                    })
                                }
                                </div>
                            </div>
                        </div>
                    </div>)
                })
                : <div className={`${styles.pagesContainer_1}`} style={{fontSize:'0.8vmax',color:'black',fontWeight:'lighter'}}>User doesn&apos;t have any active plans</div>
            }
            </div>
        </div>
    )
}

export default Today;