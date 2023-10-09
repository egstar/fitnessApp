import React, { useEffect, useState } from 'react';
import styles from '@/app/styles/profile.module.css'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  BarElement,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';
import { BarsChart, DoughnutChart, LineChart } from './Charts';


ChartJS.register(
    CategoryScale,
    BarElement,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
  );
  
  

const Home = ({isUser, setUser, isLoading, setLoading}: any) => {

  const [userPlans, setUserPlans] = useState() as any
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
  },[isUser])

  useEffect(() => {
    !userPlans ? setLoading(true) : setLoading(false)

  },[userPlans])
  if(!userPlans) return (<></>)
  return (
    <div className={`row g-0 ${styles.pagesContent}`} style={{height:'max-content'}}>
      
        <div className={styles.pagesContainer_1} style={{flexDirection:'row',background:'linear-gradient(180deg, gray, lightgray, gray)',color:'darkblue'}}>
          <div className={``} style={{width:'100%'}}>User Plan Statics</div>
          <div className={styles.pagesContainer}>
            <div className={``}>Active Plans</div>
            <div className={`${styles.graphTab}`}>
              <span>
                {
                  userPlans.filter((a: any) => new Date(a.planStart) <= new Date(Date.now()) && new Date(a.planEnd) >= new Date(a.planEnd)).length
                }
              </span>
            </div>
          </div>


          <div className={styles.pagesContainer}>
            <div className={``}>Upcoming Plans</div>
            <div className={`${styles.graphTab}`}>
              <span>
                {
                  userPlans.filter((a: any) => new Date(a.planStart) > new Date(Date.now())).length
                }
              </span>
            </div>
          </div>


          <div className={styles.pagesContainer}>
            <div className={``}>Finished Plans</div>
            <div className={`${styles.graphTab}`}>
              <span>
                {
                  userPlans.filter((a: any) => new Date(a.planStart) <= new Date(Date.now()) && new Date(a.planEnd) < new Date(a.planEnd)).length
                }
              </span>
            </div>
          </div>


          <div className={styles.pagesContainer}>
            <div className={``}>Total Plans</div>
            <div className={`${styles.graphTab}`}>
              <span>{userPlans.length}</span>
            </div>
          </div>
        </div>

        <LineChart labels={[1,2,3,4,5,6]} cData={['a','b','c','d','e','f']} />
        <BarsChart labels={[1,2,3,4,5,6]} cData={['a','b','c','d','e','f']} />
        <DoughnutChart labels={[1,2,3,4,5,6]} cData={['a','b','c','d','e','f']} />
    </div>
  )
}

export default Home;