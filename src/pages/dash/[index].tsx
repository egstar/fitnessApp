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


export default function Profile({isUser, setUser,isLogged, setLogged, cookies, setCookie, removeCookie}: any) {
    const router = useRouter()    
    const [index, setIndex] = useState(router.query.index)
    const [isLoading, setLoading] = useState(false)
    const [gotMenu, setMenu] = useState(false)
    const [data, setData] = useState([])
    const [PageInfo, setPage] = useState({} as PgInfo)
    const [isActive, setActive] = useState(0)
    
    if(isLogged && !gotMenu){
        setLoading(true)
        fetch('/api/menu', {
            method: 'GET',
            headers: {
                'Content-Type':'application/json'
            },
            credentials: 'include'
        })
        .then((res) => {
            if(res.status != 200) return {error: res.json()}
            return res.json()
        })
        .then((dt) => {
            if(!dt.error) {
                dt.filter((f: MenuItem) => f.url.toLowerCase() === String(index).toLowerCase()).map((f: MenuItem) => {
                    if(f){
                        setPage({
                            page: f.opt,
                            id: f.id,
                            tree: f.url,
                            sub: false
                        })
                        setActive(f.id)
                    }
                })
                setData(dt)
            }
        })
        setMenu(true)
        setLoading(false)
    }
    
    useEffect(() => {
        setLoading(true)
        const dataFilter = data.filter((f: MenuItem) => f.url.toLowerCase() === String(index).toLowerCase())
        if(dataFilter.length > 0){
            dataFilter.map((f: MenuItem) => {
                setPage({
                    page: f.opt,
                    id: f.id,
                    tree: f.url,
                    sub: false
                })
                setActive(f.id)
            })
        } else {
            data.filter((f: MenuItem) => f.sub).map((f: MenuItem) => {
                f.sub!.filter((s: any) => s.tree.toLowerCase() === String(index).toLowerCase())
                .map((sb: any, index: number) => {
                    setPage({
                        page: sb.sub,
                        id: sb.id,
                        tree: sb.tree,
                        sub: true,
                        subParent: f.id
                    })
                    setActive(sb.id)
                })
            })
            setLoading(false)
        }

    },[index])
    
    const tabHandler = (e:any) => {
        e.preventDefault();
        setIndex(e.currentTarget.href.split('/dash/')[1])
        
    }
    
    
    return(
        <main className={`${styles.main} ${roboto.className}`}>
            <DashNav isUser={isUser} />
            <SideMenu setUser={setUser} isUser={isUser as unknown as any} tabHandler={tabHandler} index={index} setActive={setActive} isActive={isActive} setIndex={setIndex} setPage={setPage} PageInfo={PageInfo} data={data} setData={setData} />
            {/* {isLoading ? <LoadingSpinner /> : null} */}
            <DashPage PageInfo={PageInfo} isUser={isUser} setUser={setUser} setLoading={setLoading} isLoading={isLoading}/>
        </main>
    )
}
