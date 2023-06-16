import styles from '@/app/styles/profile.module.css'
import { useState, useEffect } from 'react';



const Today = () => {
    let currentTime = new Date()
    
    const [data, setData] = useState() as any
    const [isLoading, setLoading] = useState(false)
    
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
            setLoading(false)
            } else {
                setData(null)
                setLoading(false)
            }
          })
      }, [])


    if (isLoading) return <div className={`${styles.loading}`}><span className={`${styles.loadingData}`}>Loading ...</span></div>
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
                        <button className="accordion-button" type="button" style={{boxShadow:'none',fontSize: '1.7vw', height:'max-content',textAlign:'center'}} data-bs-toggle="collapse" data-bs-target={`#userPlans${pln.pid}`} aria-expanded="true" aria-controls={`userPlans${pln.pid}`}>
                            <span className={`${styles.userPlan}`}>
                                <span  style={{fontSize: '1.9vw'}}>{pln.pname + ' Plan'}</span>
                                <span className={`${styles.tasksPercentage}`}>{tskPercentage} %</span>
                            </span>
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
                : <div className={`accordion-header ${styles.pagesContainer_1}`} style={{color:'red'}}>User has not started any plans</div>
            }
            </div>
        </div>
    )
}

export default Today;