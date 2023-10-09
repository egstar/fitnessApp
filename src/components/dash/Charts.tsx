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


export const BarsChart = ({labels,cData}: any) => {
    console.log(labels,cData)

    const options = {
        indexAxis: 'y' as const,
        responsive: true,
        elements: {
            bar: { borderWidth: 2 },
        },
        plugins: {
            legend: { position: 'right' as const },
            title: { display: true,text: `'s plan statics` }
        }
    }

    const data = {
        labels,
        datasets: [
            {
                label: 'Dataset 1',
                data: labels.map(() => faker.datatype.number({ min: 0, max: 100 })),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Dataset 2',
                data: labels.map(() => faker.datatype.number({ min: 0, max: 100 })),
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            }
        ]
    }

    return (
        <div className={styles.pagesContainer_2}>
            <Bar  data={data} options={options} />
        </div> 
    )
}



export const LineChart = ({labels,cData}: any) => {
    console.log(labels,cData)
    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' as const },
            title: { display: true, text: `'s plan statics` }
        }
    }

    const data = {
        labels,
        datasets: [
            {
                label: 'Dataset 1',
                data: labels.map(() => faker.datatype.number({ min: 0, max: 100 })),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Dataset 2',
                data: labels.map(() => faker.datatype.number({ min: 0, max: 100 })),
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            }
        ]
    }

    return (
        <div className={styles.pagesContainer_2}>
            <Line  data={data} options={options} />
        </div> 
    )
}



  
export const DoughnutChart = ({labels,cData}: any) => {
    console.log(labels,cData)

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'bottom' as const },
            title: { display: true, text: `Tasks of the day` }
        }
    }
    const data = {
        labels,
        datasets: [
            {
                label: 'Finished',
                data: labels!.map(() => faker.datatype.number({ min: 0, max: 100 })),
                backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(55, 255, 60, 0.2)',
                'rgba(255, 40, 255, 0.2)',
                'rgba(25, 159, 64, 0.2)',
                'rgba(150, 140, 30, 0.2)',
                ],
                borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(55, 255, 60, 1)',
                'rgba(255, 40, 255, 1)',
                'rgba(25, 159, 64, 1)',
                'rgba(150, 140, 30, 1)',
                ],
            }
        ]
    }
    return (
        <div className={styles.pagesContainer_2}>
            <Doughnut  data={data} options={options} />
        </div> 
    )
}