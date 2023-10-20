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
  Filler,
} from 'chart.js';
import { Line, Doughnut, Bar, Bubble } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';


ChartJS.register(
    CategoryScale,
    BarElement,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
  );


export const BarsChart = ({cData,labels}: any) => {
    cData && labels
    let lbls = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

    const options = {
        indexAxis: 'x' as const,
        responsive: true,
        elements: {
            bar: { borderWidth: 2 },
        },
        maintainAspectRatio : false,
        plugins: {
            legend: { position: 'bottom' as const },
            title: { display: true,text: `Weekly tasks statics` }
        },
        
    }
    let plans = cData.map((a:any) => { a.plan.split('-')[0] })
    let color = plans.map(() => `rgba(${Math.floor(Math.random()*100)}, ${Math.floor(Math.random()*0)}, ${Math.floor(Math.random()*120)}, 0.5)`)
    
    const data = {
        labels: lbls,
        datasets: cData.filter((a:any) => new Date(a.planStart) <= new Date() && new Date(a.planEnd) >= new Date).map((p:any,i:any) => { 
            let tasks: any = []
            let myData = 
                 Object.entries(p.tasks)
                .filter((a) => new Date(new Date(a[0])) > new Date(Date.now() - new Date().getDay() * 24 *60 * 60 * 1000) && new Date(new Date(a[0])) < new Date(Date.now() + (7- new Date().getDay()) * 24 * 60 * 60 * 1000))
                .reverse().map((a:any) => {
                    let tsks: number = 0
                    a[1].forEach((a:any) => {
                        tsks += a.tstatus
                    })
                    tasks.push(tsks)
                    return tasks
                })
            return (
                {
                    label: p.plan.split('-')[0].toString(),
                    data:  myData[0],
                    backgroundColor: color[i],
                    borderColor:  color[i],
                    pointBorderColor: 'black',
                    pointBackgroundColor: 'black'
                }
            )
        })
        
    } 
    

    return (
        <div className={styles.pagesContainer_2}>
            <Bar datasetIdKey='id' data={data} options={options} />
        </div> 
    )
}



export const LineChart = ({labels,cData}: any) => {
    labels && cData

    let lbls = labels.map((a:any) => a.tname)
    const options = {
        responsive: true,
        legend: { position: 'top' as const },
        plugins: {
            tooltip: {
                mode: 'index',
                intersect: false
            },
            title: {
                display: true,
                text: `Today statics`
            }
        },
        hover: {
            mode: 'index',
            intersec: false
        },
        scales: {
            x: {
                title: {
                display: true,
                text: 'Tasks'
                }
            },
            y: {
                title: {
                display: true,
                text: 'Done'
                },
                min: 0,
                max: 1,
                ticks: {
                // forces step size to be 50 units
                stepSize: 1
                }
            }
        }
    }

 
    let plans = cData.map((a:any) => { a.plan.split('-')[0] })
    let color = plans.map(() => `rgba(${Math.floor(Math.random()*250)}, ${Math.floor(Math.random()*250)}, ${Math.floor(Math.random()*250)}, 0.5)`)
    
    const data = {
        labels: lbls,
        datasets: cData.filter((a:any) => new Date(a.planStart) <= new Date() && new Date(a.planEnd) >= new Date).map((a:any,i:any) => { 
            let myData = 
                 Object.entries(a.tasks)
                .filter((a) => new Date(new Date(a[0])).toDateString() == new Date(new Date()).toDateString())
                .map((a:any) => {
                    
                    let tasks = [] as any
                    if(lbls.length == a[1].length) {
                       a[1].forEach((a: any) =>  tasks.push(a.tstatus))
                    } else {
                        lbls.forEach((l:any) => {
                            let found = false;
                            let i = 0
                            while( i < a[1].length && found == false){
                                found = l.includes(a[1][i].tname)
                                found ? tasks.push(a[1][i].tstatus) : null
                                i++
                            }
                            !found ? tasks.push(0) : null
                        })
                    }
                    return tasks
                })
            return (
                {
                    label: a.plan.split('-')[0].toString(),
                    data:  myData[0],
                    backgroundColor: color[i],
                    borderColor:  color[i],
                    pointBorderColor: 'black',
                    pointBackgroundColor: 'black',
                    fill:true,
                }
            )
        })
    } 

    return (
        <div className={styles.pagesContainer_2}>
            <Line  data={data} options={options} />
        </div> 
    )
}



export const DoughnutChart = ({labels,cData}: any) => {
    labels && cData
    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'bottom' as const },
            title: { display: true, text: `Active plans statics` }
        }
    }
    let plans = cData.filter((a:any) => new Date(a.planStart) <= new Date() && new Date(a.planEnd) >= new Date).map((a:any) =>  a.plan.split('-')[0])
    let color = plans.map(() => `rgba(${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, 0.5)`)

    const data = {
        labels: plans,
        datasets: [
            {
                label: 'Done tasks percentage',
                data: cData.filter((a:any) => new Date(a.planStart) <= new Date() && new Date(a.planEnd) >= new Date()).map((a:any,i:any) => {
                    const tillNowDays = Math.ceil(((new Date() as any) - (new Date(new Date(a.planStart).toLocaleDateString('en')) as any))/1000/60/60/24)
                    const planDays = (((new Date(a.planEnd) as any) - (new Date(a.planStart) as any))/1000/60/60/24)
                    const dailyTasksCount = Number(a.planStates.totalTasks) / planDays
                    const currentTasks = Math.ceil(dailyTasksCount * tillNowDays)
                    return (a.planStates.totalDone/currentTasks * 100).toFixed(2)
                }),
                backgroundColor: color,
                borderColor:  color
            },
        ]
    }

    return (
        <div className={styles.pagesContainer_2}>
            <Doughnut data={data} options={options} />
        </div> 
    )
}