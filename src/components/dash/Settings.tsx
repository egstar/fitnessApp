import { User } from "@/data/types"
import * as BsIcons from 'react-icons/bs'
import LoadingSpinner from "../Loading"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import styles from '@/app/styles/profile.module.css'



export const Settings = () => {
    
    const [user, setUser] = useState({}) as any
    const [isLoading, setLoading] = useState(false)
    const [info, setInfo] = useState() as any
    const [plans, setPlans] = useState() as any
    const [chPass, switchPass] = useState(false)
    const [usrImg, setUsrImg] = useState() as any
    const hiddenInput = useRef() as any
    const [usrImage, setUsrImage] = useState('') as any

    const getImage = async()=> {
        const userImage: string = user.img ? '/assets/imgs/users/'+user.img : '/assets/imgs/users/usr.png'
        const file = await fetch(userImage)
        const imgBlob = await file.blob()
        const UsrImg = URL.createObjectURL(imgBlob)
        setUsrImage(UsrImg)
    }

    useEffect(() => {
        getImage()
    }, [])

    function getElm(elm: string) {
        const elms: any = {
            uid: 'User ID',
            uname: 'Username',
            fname: 'Firstname',
            lname: 'Lastname',
            email: 'Email address',
            level: 'User Access',
            regdate: 'Registeration date'
        }
        return elms[elm] 
    }
    useEffect(() => {
        setLoading(true)
        fetch('/api/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        }).then((res) => {
            if(res.status !== 200) throw new Error(`Access denied`)
            return res.json()
        }).then((data) => {
            setUser(data)
        })
        fetch('/api/plans', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        }).then((res) => {
            if(res.status !== 200) throw new Error(`Access denied`)
            return res.json()
        }).then((data) => {
            setPlans(data)
        })
        setLoading(false)
    }, [])
    
    function selectFile(e: any) {
        hiddenInput.current.click()
    }
    function selectedImage(e: any){
        const img = URL.createObjectURL(e.target.files[0])
        console.log(img)
        setUsrImg(img)
        
    }

    function formUpdate(e: any) {
        const entryData = {...info}
        entryData[e.currentTarget.id]= e.currentTarget.value
        setInfo(entryData)
    }
    function changePass(e: any) {
        if(e.currentTarget.checked) {switchPass(true)} else {switchPass(false)}

    }

    if(isLoading) return(<LoadingSpinner />)

    return (
        <div className={styles.pagesContent}>
            <div className={styles.pagesContainer_1}>
                User Settings
            </div>
            <div className={styles.pagesContainer_2}>
                <h4>User Info</h4>
                <form>
                    <div className={styles.pagesContainer_1}>
                    <div className={`input-group`}>
                        <div className={`form-floating`}>
                            <input className={`form-control form-control-sm`} onChange={formUpdate} placeholder={getElm('uname')} type="text" id={'uname'} name={'uname'} defaultValue={user.uname} style={{boxShadow:'none', outline:'none', background:'transparent',border:'0 0 0 1px solid white'}} autoComplete="disabled"  disabled/>
                            <label className={`input-label`} htmlFor={'uname'}>{getElm('uname')}</label>
                        </div>
                    </div>
                    <div className={`input-group`}>
                        <div className={`form-floating`}>
                            <input className={`form-control form-control-sm`} onChange={formUpdate} placeholder={getElm('fname')} type="text" id={'fname'} name={'fname'} defaultValue={user.fname} style={{boxShadow:'none', outline:'none', background:'transparent',border:'0 0 0 1px solid white'}} autoComplete="disabled"/>
                            <label className={`input-label`} htmlFor={'fname'}>{getElm('fname')}</label>
                        </div>
                        <div className={`form-floating`}>
                            <input className={`form-control form-control-sm`} onChange={formUpdate} placeholder={getElm('lname')} type="text" id={'lname'} name={'lname'} defaultValue={user.lname} style={{boxShadow:'none', outline:'none', background:'transparent',border:'0 0 0 1px solid white'}} autoComplete="disabled"/>
                            <label className={`input-label`} htmlFor={'lname'}>{getElm('lname')}</label>
                        </div>
                    </div>
                    </div>
                    <div className={`input-group`}>
                        <div className={`form-floating`}>
                            <input className={`form-control form-control-sm`} onChange={formUpdate} placeholder={getElm('email')} type="text" id={'email'} name={'email'} defaultValue={user.email} style={{boxShadow:'none', outline:'none', background:'transparent',border:'0 0 0 1px solid white'}} autoComplete="disabled" />
                            <label className={`input-label`} htmlFor={'email'}>{getElm('email')}</label>
                        </div>
                    </div>
                    <div className={styles.pagesContainer_1}>
                        <div className={`input-group`}>
                            <div className="form-check form-switch" style={{textAlign:'left'}}>
                                <input className="form-check-input" type="checkbox" onChange={changePass} role="switch" id={`changePassword`} name={`changePassword`} />
                                <label className="form-check-label" htmlFor="changePassword">Change password</label>
                            </div>
                        </div>
                        {
                            chPass ?
                            (<><div className={`input-group`}>
                                <div className={`form-floating`}>
                                    <input className={`form-control form-control-sm`} onChange={formUpdate} placeholder={'Old Password'} type="password" id={'pass'} name={'pass'} defaultValue={`*******`} style={{boxShadow:'none', outline:'none', background:'transparent',borderBottom:'1px solid white'}} />
                                    <label className={`input-label`} htmlFor={'pass'}>{'Old Password'}</label>
                                </div>
                            </div>
                            <div className={`input-group`}>
                                <div className={`form-floating`}>
                                    <input className={`form-control form-control-sm`} onChange={formUpdate} placeholder={'New Password'} type="password" id={'pass1'} name={'pass1'} defaultValue={`*******`} style={{boxShadow:'none', outline:'none', background:'transparent',borderBottom:'1px solid white'}} />
                                    <label className={`input-label`} htmlFor={'pass1'}>{'New Password'}</label>
                                </div>
                                <div className={`form-floating`}>
                                    <input className={`form-control form-control-sm`} onChange={formUpdate} placeholder={'Confirm new password'} type="password" id={'pass2'} name={'pass2'} defaultValue={`*******`} style={{boxShadow:'none', outline:'none', background:'transparent',borderBottom:'1px solid white'}} />
                                    <label className={`input-label`} htmlFor={'pass2'}>{'Confirm password'}</label>
                                </div>
                            </div></>)
                            : null
                        }
                    </div>
                        <div className={styles.pagesContainer_1}>
                            <div>
                                <div className={styles.settingsImageFrame}>
                                    <Image className={styles.settingsUserImage}
                                        src={usrImg  ? usrImg : usrImage}
                                        width={230}
                                        height={230}
                                        alt={user? user.fname + ' ' + user.lname : 'Profile Picture'}
                                    />
                                </div>
                                <label htmlFor="userImage" onClick={selectFile} className="form-label">Change image</label>
                                <input ref={hiddenInput} onChange={selectedImage} className={`form-control form-control-md ${styles.fileSelect}`} id="userImage" type="file"  accept={'.jpg,.png,.jpeg,.svg'} hidden />
                            </div>
                        </div>
                </form>
            </div>
            <div className={styles.pagesContainer_2}>
                <h4>Plans Info</h4>
                <ul className={`${styles.userPlanList}`} >
                    {
                        plans
                        ? plans.map((pl: any, index:number) => {
                            return (
                                <li key={index} className={`row g-0 ${styles.planList}`} data-pid={pl.tasks.pid}>
                                    <span className={`col-sm-10 ${styles.planLine}`} >{pl.plan}</span><span className={`col-sm-2 ${styles.planLineTools}`} ><BsIcons.BsGearFill className={`${styles.planIcons}`} style={{color:'gray'}} /> <BsIcons.BsXCircleFill fill="darkred" className={`${styles.planIcons}`} /> </span>
                                </li>
                            )
                        })
                        : (
                            <li className={styles.planList}>
                                Empty Plan
                            </li>
                        )
                    }
                </ul>
            </div>
        </div>
    
    )
}