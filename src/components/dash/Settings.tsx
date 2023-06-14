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
    const [usrImg, setUsrImg] = useState('') as any
    const [usrImage, setUsrImage] = useState('') as any
    const [base64Image, setBase64Image] = useState() as any
    const [newImage, setNewImage] = useState(false)
    const hiddenInput = useRef() as any

    async function getBase64(file: File) {
        let reader = new FileReader();
        reader.onload = function () {
            setBase64Image(reader.result)
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
        reader.readAsDataURL(file);
    }

    const getImage = async()=> {
        const userImage: string = usrImg ? usrImg : user.img ? user.img : `data:image/png;base64,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`
        const file = await fetch(userImage)
        const imgBlob = await file.blob()
        const UsrImage = URL.createObjectURL(imgBlob)
        setUsrImage(UsrImage)
        setNewImage(false)
    }

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
            getImage()
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
    async function selectedImage(e: any){
        await getBase64(e.target.files[0]).then(async() =>{
            const imageBuffer = await fetch(base64Image)
            const imageBlob = await imageBuffer.blob()
            const img = URL.createObjectURL(imageBlob)
            setUsrImg(img)
            setNewImage(true)
        })
    }
    
    useEffect(() => {
        if(newImage){
            fetch('/api/userinfo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({img: base64Image,newImage,uid: user.uid})
            }).then((res: any)=> {
                if(res.status !== 200) console.log('Error')
                return res.json()
            }).then((data: any) => {
                setUsrImg(base64Image)
            })
        }
        getImage()
        setNewImage(false)
    }, [base64Image,newImage])

    function formUpdate(e: any) {
        const entryData = {...info}
        entryData[e.currentTarget.id]= e.currentTarget.value
        setInfo(entryData)
    }
    function changePass(e: any) {
        if(e.currentTarget.checked) {
            switchPass(true)
        } else {
            switchPass(false)
        }
    }
    function submitForm(e: any) {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        formData.append('uid', user.uid)
        let bodyData = {}
        formData.forEach((a:any,b:any) => {
            bodyData = {...bodyData, [b]: a}
        })
        console.log(bodyData)
        fetch('/api/userinfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({...bodyData})
        }).then((res: any) => {
            if(res.status !== 200) console.log('Error')
            return res.json()
        }).then((data) => {
            console.log(data.message)
        })
    }


    if(isLoading) return(<LoadingSpinner />)

    return (
        <div className={styles.pagesContent}>
            <div className={styles.pagesContainer_1}>
                User Settings
            </div>
            <div className={styles.pagesContainer_2}>
                <h4>User Info</h4>
                <form onSubmit={submitForm}>
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
                                    <input className={`form-control form-control-sm`} onChange={formUpdate} placeholder={'Old Password'} type="password" id={'upass'} name={'upass'} defaultValue={`*******`} style={{boxShadow:'none', outline:'none', background:'transparent',borderBottom:'1px solid white'}} />
                                    <label className={`input-label`} htmlFor={'upass'}>{'Old Password'}</label>
                                </div>
                            </div>
                            <div className={`input-group`}>
                                <div className={`form-floating`}>
                                    <input className={`form-control form-control-sm`} onChange={formUpdate} placeholder={'New Password'} type="password" id={'newpass'} name={'newpass'} defaultValue={`*******`} style={{boxShadow:'none', outline:'none', background:'transparent',borderBottom:'1px solid white'}} />
                                    <label className={`input-label`} htmlFor={'newpass'}>{'New Password'}</label>
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
                        <div className={styles.settingsImageFrame}>
                            <Image className={styles.settingsUserImage}
                                src={usrImage}
                                width={640}
                                height={640}
                                alt={user? user.fname + ' ' + user.lname : 'Profile Picture'}
                            />
                            <label htmlFor="userImage" onClick={selectFile} className={`form-label ${styles.changeImage}`}><BsIcons.BsCameraFill /> </label>
                        </div>
                        <input ref={hiddenInput} onChange={selectedImage} className={`form-control form-control-md ${styles.fileSelect}`} id="userImage" type="file"  accept={'.jpg,.png,.jpeg,.svg'} hidden />
                    </div>
                    <input type='submit' className={`btn btn-outline-success btn-sm ${styles.submitButton}`} name='Update' value={`Update info`} />
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
                                    <span className={`col-10 ${styles.planLine}`} >{pl.plan}</span><span className={`col-2 ${styles.planLineTools}`} ><BsIcons.BsGearFill className={`${styles.planIcons}`} style={{color:'gray'}} /> <BsIcons.BsXCircleFill fill="darkred" className={`${styles.planIcons}`} /> </span>
                                </li>
                            )
                        })
                        : (
                            <li className={styles.planList}>
                                <span className={`col-12 ${styles.planLine}`} >Empty Plan</span>
                            </li>
                        )
                    }
                </ul>
            </div>
        </div>
    
    )
}