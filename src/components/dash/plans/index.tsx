import styles from '@/app/styles/profile.module.css'
import * as BsIcons from 'react-icons/bs';
import "react-datepicker/dist/react-datepicker.css";
import {useState, useEffect} from 'react'
import DatePicker from "react-datepicker";
import useSWR from 'swr';
import LoadingSpinner from '@/components/Loading';

const fetcher = async (url: any) => await fetch(url, {
    method:'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    credentials: 'include'
}).then(r => r.json())

export const CreaetPlan = () => {
    const [cusTasks, setCusTasks] = useState(false)
    const [plan, setPlan] = useState() as any
    const [tasks , setTasks] = useState([]) as any
    const [dur, setDur] = useState(0)
    const [aTask, setaTask] = useState('')
    const [newPlan , setNewPlan] = useState(true)
    const [userPlans , setPlanDetails] = useState({
        planName: '',
        planDuration: 0,
        planId: 0
    }) as any
    
    const [taskName, setTaskName] = useState([]) as any

    const { data: fData, error } = useSWR<Object>('/api/plans/getplans', fetcher)
    const [fetched, setFetched] = useState() as any

    const [startDate, setStartDate] = useState(new Date())
    const [isOpen, setIsOpen] = useState(false)
    
    useEffect(() => {
        if(fData) setFetched(fData)
    },[fData])

    const handleDateChange = (e: any) => {
        setIsOpen(!isOpen);
        setStartDate(e);
    };

    const handleDateClick = (e: any) => {
        e.preventDefault();
        setIsOpen(!isOpen);
    };
    
    const handleSubmit = (e: any) => {
        e.preventDefault();
        if(!userPlans.planDuration && !userPlans.planName) {
            console.log(`MissingData...`)
        } else {
            if(cusTasks && 0 < tasks.length && tasks.length < 10){
                fetch('/api/plans/create', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        planStart: startDate,
                        planDuration: userPlans.planDuration,
                        planName: userPlans.planName+'[userplan]'+(new Date().getTime()).toFixed().toString(),
                        planTasks: [...tasks]
                    })
                }).then((res) => res )
                .then((data) => console.log(data))
            } else {
                fetch('/api/plans/create', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        planStart: startDate,
                        planDuration: userPlans.planDuration,
                        planName: userPlans.planName+'[userplan]'+(new Date().getTime()).toFixed().toString()
                    })
                }).then((res) =>  res )
                .then((data) => console.log(data))

            }
        }
    }

    const handlePlan = (e: any) => {
        if(e.currentTarget.dataset.planid == 0){
            setNewPlan(true)
            setTasks([])
            setTaskName([])
            setPlanDetails({
                planName: e.currentTarget.dataset.planname,
                planId: e.currentTarget.dataset.planid,
                planDuration: e.currentTarget.dataset.planduration
            })
        } else {
            setNewPlan(false)
            setTasks([])
            setTaskName([])
            setCusTasks(false)
            setPlanDetails({
                planName: e.currentTarget.dataset.planname,
                planId: e.currentTarget.dataset.planid,
                planDuration: e.currentTarget.dataset.planduration
            })
        }
    }

    const activeTask = (e: any) => {
        const currentTasks = tasks
        const tsksName = taskName

        if(e.currentTarget.checked){
            currentTasks!.push(Number(e.currentTarget.dataset['tid']!))
            tsksName.push(e.currentTarget.value)
            setaTask(e.currentTarget.value)
            setTaskName(tsksName)
            setTasks(currentTasks)
        } else {
            currentTasks!.pop(Number(e.currentTarget.dataset['tid']!))
            tsksName.pop(e.currentTarget.value)
            setaTask(e.currentTarget.value)
            setTaskName(tsksName)
            setTasks(currentTasks)
        }
    }

    const customTasksHandler = (e:any) => {
        e.currentTarget.checked
            ? setCusTasks(!cusTasks)
            : setCusTasks(false)
        setTasks([])
        setTaskName([])
    }

    const handleCLose = (e: any) => {
        setIsOpen(false)
    }

    const planChangeHandler = (e: any) => {
        const oldUserPlans = userPlans
        e.currentTarget.value.length > 0 ? setPlan(e.currentTarget.value) : setPlan(null)
        oldUserPlans.planName = e.currentTarget.value
        setPlanDetails(oldUserPlans)
    }

    const durHandler = (e: any) => {
        
        e.currentTarget.addEventListener('keydown', (ev:any) => {
            console.log(ev.keyCode)
        })
        const oldUserPlans = userPlans
        e.currentTarget.value.length > 0 ? setDur(e.currentTarget.value) : setDur(0)
        oldUserPlans.planDuration = e.currentTarget.value
        setPlanDetails(oldUserPlans)
    }

    if (!fetched) (<LoadingSpinner />)

    return (
        <>
        <div className={styles.pagesContent}>
            <div className={`${styles.pagesContainer_1}`}>
                Create user plan
            </div>
            <div className={`${styles.formGroup}`}>
                <div className={`${styles.planChoices} ${userPlans && userPlans.planId == 0 ? styles.activePlan : null}`} data-planid={0} data-planname={''} data-planduration={0} onClick={handlePlan}><span><BsIcons.BsPlus /> </span></div>
                {
                    fetched
                    ? fetched.defaultP.map((elm: any, index: number) => {
                        return (
                            <div key={index} className={`${styles.planChoices} ${userPlans && userPlans.planId == elm.id ? styles.activePlan : null}`} data-planid={elm.id} data-planname={elm.pname} data-planduration={elm.duration} onClick={handlePlan}>
                                <div className={styles.planTitle}>Default</div>
                                <div className={styles.planText}>{elm.pname} Plan</div>
                                <div className={styles.planTail}>{elm.duration} days</div>
                            </div>)
                    }) 
                    : null
                }
            </div>

            { newPlan 
            ?(
                <>
                <div className={styles.pagesContainer_2}>
                        <span className={styles.planTitle}>
                            Plan Details
                        </span>
                        <span className={styles.planTitleData}>
                            
                                {
                                    userPlans
                                    ? (
                                        <ul style={{textAlign:'left',listStyle:'outside'}}>
                                            <li>Plan name: <span style={{color:'maroon',textDecoration:'underline dashed'}}>{userPlans.planName}</span></li>
                                            <li>Plan duration: <span style={{color:'maroon',textDecoration:'underline dashed'}}>{userPlans.planDuration}</span></li>
                                            <li>Starting: <span style={{color:'maroon',textDecoration:'underline dashed'}}>{startDate.toLocaleDateString('en-UK', {
                                                weekday:'long',
                                                day:'2-digit',
                                                month:'short',
                                                year:'numeric'
                                            })}</span></li>
                                            <li>Tasks:
                                                <ul style={{display:'flex', alignContent:'center', flexWrap:'wrap', gap:'0.5rem',fontSize:'.8em',color:'purple',textDecoration:'underline dashed',textUnderlinePosition:'under', }}> 
                                                {
                                                    cusTasks 
                                                    ? taskName!.map((def:any , index:any) => {
                                                        return (<li key={index} style={{width:'calc(100% / 2 - .5rem)'}}>{def}</li>)
                                                    })
                                                    : fetched && fetched!.defaultT.map((def:any, index:number) => {
                                                        return (<li key={index} style={{width:'calc(100% / 2 - .5rem)'}}>{def.tname}</li>)
                                                    })
                                                }
                                                </ul>
                                            </li>
                                        </ul>
                                    )

                                    : null
                                }
                        </span>
                        <span>
                            <div className="col-auto">
                                <button type="submit" className="btn btn-primary m-3 px-5" onClick={handleSubmit} disabled={userPlans.planName && userPlans.planDuration > 0 ? false : true}>Start plan</button>
                            </div>
                        </span>
                    </div>
                    <div className={styles.pagesContainer_2}>
                        <span className={styles.planForm}>
                            Set plan details
                        </span>
                        <form id="createPlan" className={`form ${styles.formContainer}`} action={``} method=''>
                        <div className={`${styles.pagesContainer_1}`}>
                                <div className="form-floating">
                                    <input type="text" className="form-control" id="planName" placeholder="Plan name" onChange={planChangeHandler} value={userPlans.planName}  style={{boxShadow:'none', outline:'none', background:'transparent',borderBottom:'1px solid white'}}/>
                                    <label htmlFor="planName">Plan name</label>
                                </div>
                        </div>
                        <div className={`${styles.pagesContainer_1}`}>
                                <label htmlFor="datePicker">Starting date</label>
                                <button id="datePicker" className="btn btn-sm btn-success" onClick={handleDateClick} style={{ padding:'1rem 0'}} >
                                        {startDate.toLocaleDateString('en-UK', {
                                            day:'2-digit',
                                            month:'2-digit',
                                            year:'numeric'
                                        })}
                                </button>
                            
                        </div>
                        <div className={`${styles.pagesContainer_1}`} >
                            <div className="form-floating">
                                <input type="text" className="form-control" id="planDuration" placeholder="Duration" onChange={(e) =>durHandler(e)} value={userPlans.planDuration} style={{boxShadow:'none', outline:'none', background:'transparent',borderBottom:'1px solid white'}} />
                                <label htmlFor="planDuration">Plan duration</label>
                            </div>

                        </div>
                        <span className={`${styles.datePicker}`} style={{width:'100%'}}>
                        {isOpen && (
                                    <DatePicker 
                                    selected={startDate} 
                                    onChange={handleDateChange}
                                    minDate={new Date()}
                                    showYearDropdown
                                    onClickOutside={handleCLose}
                                    inline />
                                )}
                        </span>
                        <div className={styles.pagesContainer_1}>
                            <div className="form-check form-switch" style={{textAlign:'left'}}>
                                <input className="form-check-input" type="checkbox" role="switch" id="customTasks" onClick={customTasksHandler} />
                                <label className="form-check-label" htmlFor="customTasks">Custom tasks</label>
                            </div>
                        </div>
                            {
                                cusTasks 
                                ? (
                                    <div className={`${styles.pagesContainer_1}`}>
                                        <div className={`form-group ${styles.formGroup}`}>
                                        {
                                            fetched
                                            ? fetched.defaultT.map((elm: any, index: number) => {
                                                return (
                                                    <div key={index}>
                                                        <input data-tid={elm.id} type="checkbox" className="btn-check outlined" name={`task${elm.id}`} onChange={activeTask} id={`task${index}`} value={elm.tname} autoComplete="off" />
                                                        <label className="btn btn-outline-primary" htmlFor={`task${index}`} style={{width:'6.5rem', height:'5rem', overflow:'hidden', textOverflow:'ellipsis',wordBreak:'break-word' }}>{elm.tname}</label>
                                                    </div>
                                                )
                                            }) 
                                            : null
                                        }
                                        </div>
                                    </div>

                                )
                                : (<></>)
                            }
                        </form>
                    </div>
                </>
            )
            : (
                <>
                    <div className={styles.pagesContainer_2}>
                        <span className={styles.planTitle}>
                            Plan Details
                        </span>
                        <span className={styles.planTitleData}>
                            
                                {
                                    userPlans 
                                    ? (
                                        <ul style={{textAlign:'left',listStyle:'outside'}}>
                                            <li>Plan name: <span style={{color:'maroon',textDecoration:'underline dashed'}}>{userPlans.planName}</span></li>
                                            <li>Plan duration: <span style={{color:'maroon',textDecoration:'underline dashed'}}>{userPlans.planDuration}</span></li>
                                            <li>Starting: <span style={{color:'maroon',textDecoration:'underline dashed'}}>{startDate.toLocaleDateString('en-UK', {
                                                weekday:'long',
                                                day:'2-digit',
                                                month:'short',
                                                year:'numeric'
                                            })}</span></li>
                                            <li>Tasks:<ul style={{display:'flex', alignContent:'center', flexWrap:'wrap', gap:'0.5rem',fontSize:'.8em',color:'purple',textDecoration:'underline dashed',textUnderlinePosition:'under', }}> {
                                                
                                                fetched ? fetched.defaultT.map((def: any, index:any) => {
                                                    return (<li key={index} style={{width:'calc(100% / 2 - .5rem)'}}>{def.tname}</li>)
                                                })
                                                : null
                                            }</ul></li>
                                        </ul>
                                    )

                                    : null
                                }
                        </span>
                        <span>
                            <div className="col-auto">
                                <button type="submit" className="btn btn-primary mb-3" onClick={handleSubmit} disabled={userPlans.planName && userPlans.planDuration > 0 ? false : true}>Start plan</button>
                            </div>
                        </span>
                    </div>
                    <div className={styles.pagesContainer_2}>
                        <span className={styles.planForm}>
                            Set plan name & start date
                        </span>
                        <form id="createPlan" className={`form`} action={``} method=''>
                            <div className={`${styles.pagesContainer_1}`}>
                                <div className="form-floating">
                                    <input type="text" className="form-control" id="planName" placeholder="Plan name" onChange={(e) => planChangeHandler(e)} value={userPlans.planName} style={{boxShadow:'none', outline:'none', background:'transparent',borderBottom:'1px solid white'}}/>
                                    <label htmlFor="planName">Plan name</label>
                                </div>
                            </div>
                            <div className={`${styles.pagesContainer_1}`}>
                                <button className="btn btn-sm btn-primary" onClick={handleDateClick} style={{ padding:'1rem 0'}} >
                                        {startDate.toLocaleDateString('en-UK', {
                                            day:'2-digit',
                                            month:'2-digit',
                                            year:'numeric'
                                        })}
                                </button>
                            </div>
                            <span className={`${styles.datePicker}`} style={{width:'100%'}}>
                                    {isOpen && (
                                        <DatePicker 
                                        selected={startDate} 
                                        onChange={handleDateChange}
                                        minDate={new Date()}
                                        showYearDropdown
                                        inline />
                                    )}
                            </span>
                            
                        </form>
                    </div>
                </>
            )}
        </div>
        </>
    )
}