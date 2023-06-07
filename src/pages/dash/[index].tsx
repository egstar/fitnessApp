import styles from '@/app/styles/profile.module.css'
import DashNav from '@/components/dash/nvabar';
import { MenuItem, PgInfo } from '@/data/types';
import { useRouter } from 'next/router'
import {  useEffect, useState } from 'react';
import LoadingSpinner from '@/components/Loading';
import { roboto } from '@/pages/index';
import { User } from '@/data/types';
import DashPage from '@/components/dash/routepage';
import SideMenu from '@/components/dash/sidemenu';
import { useCookies } from 'react-cookie';
import { uToken } from '../_app';


export default function Profile() {
    const router = useRouter()    
    const [index, setIndex] = useState(router.query.index)
    const [isUser, setUser] = useState({} as User)
    const [isLogged, setLogged] = useState(false)
    const [isLoading, setLoading] = useState(false)
    const [gotMenu, setMenu] = useState(false)
    const [data, setData] = useState([])
    const [PageInfo, setPage] = useState({} as PgInfo)
    const [isActive, setActive] = useState(0)
    const [cookies, setCookie, removeCookie] = useCookies([uToken])

    
    useEffect(() => {
        if(!isLogged){
            fetch('/api/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            })
            .then((res) => {
                if(res.status != 200 ) { 
                    removeCookie(uToken)
                    router.replace('/')
                }
                return res.json()
            }).then((data) => {
                if(isUser != data) setUser(data)

                setLogged(true)
            })
        }
    }, [])

    if(isLogged && !gotMenu){
        setLoading(true)
        fetch('/api/menu', {
            method: 'GET',
            headers: {
                'Content-Type':'application/json'
            },
            credentials: 'include'
        })
        .then((res) => res.json())
        .then((dt) => {
            dt.filter((f: MenuItem) => f.url.toLowerCase() === String(index).toLowerCase()).map((f: MenuItem) => {
                if(f){
                    setPage({
                        page: f.opt,
                        id: f.id,
                        tree: f.url
                    })
                    setActive(f.id)
                }
            })
            setData(dt)
        })
        setMenu(true)
        setLoading(false)
    }
    
    useEffect(() => {
        setLoading(true)
        data.filter((f: MenuItem) => f.url.toLowerCase() === String(index).toLowerCase()).map((f: MenuItem) => {
            if(f){
                setPage({
                    page: f.opt,
                    id: f.id,
                    tree: f.url
                })
                setActive(f.id)
            } else {
                setPage({
                    page: 'Dashboard',
                    id: 1,
                    tree: 'home'
                })
                setActive(1)
            }
            setLoading(false)
        })
        
    },[index])
    
    const tabHandler = (e:any) => {
        e.preventDefault();
        setIndex(e.currentTarget.href.split('/dash/')[1])
    }
    if(isLoading) return (<LoadingSpinner />)
    if(gotMenu == false || !isUser || !index) return (<LoadingSpinner />)
    return(
        <main className={`${styles.main} ${roboto.className}`}>
            <DashNav isUser={isUser as unknown as any} />
            <SideMenu isUser={isUser as unknown as any} tabHandler={tabHandler} index={index} setActive={setActive} isActive={isActive} setIndex={setIndex} setPage={setPage} PageInfo={PageInfo} data={data} setData={setData} />
            <DashPage PageInfo={PageInfo} />
        </main>
    )
}
