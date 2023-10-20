import React, { useEffect, useState } from 'react';
import styles from '@/app/styles/profile.module.css'
import { BarsChart, DoughnutChart, LineChart } from './Charts';


  

const Home = ({isUser, setUser, isLoading, setLoading}: any) => {

  const [userPlans, setUserPlans] = useState() as any
  const [labels, setLabels] = useState() as any
  useEffect(() => {
     fetch('/api/plans', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'

    }).then((res) => {
      if(res.status != 200) return {error: res.json()}
      return res.json()
    }).then((data) => {
      setUserPlans(data)
    })
    fetch('/api/tasks', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    }).then((res) => {
      if(res.status != 200) return {error: res.json()}
      return res.json()
    }).then((data) => {
      setLabels(data)
    })
  },[isUser])


  useEffect(() => {
    !userPlans ? setLoading(true) : setLoading(false)

  },[userPlans])
  if(!userPlans || userPlans.length == 0) return (<></>)
  // userPlans.map((a:any) => {
  //   new Date(a.planStart) <= new Date() 
  //     ? console.log(a.pid, '\n',
  //      a.plan.split('-')[0], '\n', 
  //      a.planStates.totalDone, '\n', 
  //       a.planStates.totalTasks, 
  //       Object.entries(a.planStates.tasksDone).map((a:any ,b:any) => a[0]),
  //       Object.entries(a.planStates.tasksDone).map((a:any ,b:any) => a[1]))
  //     : null
  // })
  return (
    <div className={`row g-0 ${styles.pagesContent}`} style={{height:'max-content'}}>
      
        <div className={styles.pagesContainer_1} style={{flexDirection:'row',background:'linear-gradient(180deg, gray, lightgray, gray)',color:'darkblue'}}>
          <div className={`${styles.containerTitle}`} style={{width:'100%'}}>User Plan Statics</div>
          <div className={styles.pagesContainer} style={{color:'white',border: '4px dotted lightslategray',borderRadius:'25%',borderTop:'4px solid green',background:'rgba(0,200,0,0.3)'}}>
            <div className={`${styles.graphTitle}`}>Active Plans</div>
            <div className={`${styles.graphTab}`}>
              <span>
                {
                  userPlans.filter((a: any) => new Date(a.planStart) <= new Date(Date.now()) && new Date(a.planEnd) >= new Date()).length
                }
              </span>
            </div>
          </div>
        


          <div className={styles.pagesContainer} style={{color:'white',border: '4px dotted lightslategray',borderRadius:'25%',borderTop:'4px solid orange',background:'rgba(255,200,0,0.3)'}}>
            <div className={`${styles.graphTitle}`}>Upcoming Plans</div>
            <div className={`${styles.graphTab}`}>
              <span>
                {
                  userPlans.filter((a: any) => new Date(a.planStart) > new Date(Date.now())).length
                }
              </span>
            </div>
          </div>


          <div className={styles.pagesContainer} style={{color:'white',border: '4px dotted lightslategray',borderRadius:'25%',borderTop:'4px solid red',background:'rgba(200,0,0,0.3)'}}>
            <div className={`${styles.graphTitle}`}>Finished Plans</div>
            <div className={`${styles.graphTab}`}>
              <span>
                {
                  userPlans.filter((a: any) => new Date(a.planEnd) < new Date()).length
                }
              </span>
            </div>
          </div>


          <div className={styles.pagesContainer} style={{color:'white',border: '4px dotted lightslategray',borderRadius:'25%',borderTop:'4px solid #583b63',background:'#583b6303'}}>
            <div className={`${styles.graphTitle}`}>Total Plans</div>
            <div className={`${styles.graphTab}`}>
              <span>{userPlans.length}</span>
            </div>
          </div>
        </div>

        
        
        <BarsChart cData={userPlans} labels={labels} />
        <LineChart cData={userPlans} labels={labels} />
        <DoughnutChart cData={userPlans} labels={labels} />
    </div>
  )
}

export default Home;