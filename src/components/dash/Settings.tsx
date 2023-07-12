import { User } from "@/data/types"
import * as BsIcons from 'react-icons/bs'
import LoadingSpinner from "../Loading"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import styles from '@/app/styles/profile.module.css'
import { useRouter } from "next/router"
import { ErrorAlert } from "@/components/Error"
import { UserImage } from "./userImage"
import ValidateForm from "@/models/FormValidation"



export const Settings = ({isUser, setUser,isLoading, setLoading}: any) => {
    const router = useRouter()
    
    
    const [info, setInfo] = useState() as any
    const [plans, setPlans] = useState() as any
    const [chPass, switchPass] = useState(false)
    const [usrImage, setUsrImage] = useState() as any
    const [base64Image, setBase64Image] = useState() as any
    const [newImage, setNewImage] = useState(false)
    const [errorMessage, setErrorMessage ] = useState() as any
    const [err, setError] = useState(false)
    const [updateImage, setUpdateImage] = useState(false)
    const hiddenInput = useRef() as any
    const newPass1 = useRef() as any
    const newPass2 = useRef() as any

    // Change image file to base64
    async function getBase64(file: File) {
        let reader = new FileReader();
        reader.onload = function () {
            setBase64Image(reader.result)
        };
        reader.onerror = function (error) {
            setErrorMessage({msg: 'Error, cannot handle the file', atype: 'alert-danger'})
            setTimeout(() => setErrorMessage(), 5000)
        };
        reader.readAsDataURL(file);
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
    // Fetch data upon section loading
    useEffect(() => {
        setLoading(true)
        // Fetch user plans 
        fetch('/api/plans', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        }).then((res) => {
            if(res.status !== 200) setError(true)
            return res.json()
        }).then((data) => {
            setPlans(data)
        })
        setLoading(false)
    }, [])
    // Image selection via capture button
    function selectFile(e: any) {
        hiddenInput.current.focus()
        hiddenInput.current.click()
        setUpdateImage(false)
    }
    // On Image change handler
    async function selectedImage(e: any){
        const mimeTypes = ['image/jpeg','image/png','image/jpg','image/webp']
        if(mimeTypes.includes(e.target.files[0].type)){
            await getBase64(e.target.files[0]).then(async() =>{
                const imageBuffer = await fetch(base64Image)
                const imageBlob = await imageBuffer.blob()
                const img = URL.createObjectURL(await imageBlob)
                setUsrImage(img)
                setNewImage(true)
            })
        } else {
            setError(true)
            setErrorMessage({msg: 'Invalid file, please choose supported files only.', atype: 'alert-danger'})
            setTimeout(() => setErrorMessage(), 5000)
        }
    }
    // Update image into database directly
    useEffect(() => {
        if(newImage){
            fetch('/api/userinfo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({img: base64Image,newImage,uid: isUser.uid})
            }).then((res: any)=> {
                if(res.status !== 200) setError(true)
                return res.json()
            }).then((data: any) => {
                if(data.message) {
                    const userUpdate = [isUser]
                    setUpdateImage(true)
                    setUser(...userUpdate, {img: base64Image})
                    setErrorMessage({msg: data.message , atype: 'alert-success'})
                    setTimeout(() => setErrorMessage(), 5000)
                }
                if(data.error) {
                    setErrorMessage({msg: data.error , atype: 'alert-danger'})
                    setTimeout(() => setErrorMessage(), 5000)
                }
            })
        }
        setNewImage(false)
    }, [base64Image,newImage])
    // Form input fields update handler
    function formUpdate(e: any) {
        const entryData = {...info}
        entryData[e.currentTarget.id] = e.currentTarget.value
        if(chPass) {
            if(newPass1.current.value != newPass2.current.value){
                setError(true)
                newPass1.current.classList.add('is-invalid')
            } else {
                setError(false)
                newPass1.current.classList.remove('is-invalid')
            }
        }
        ValidateForm()
        setInfo(entryData)
    }
    // Password toggler checker
    function changePass(e: any) {
        if(e.currentTarget.checked) {
            switchPass(true)
        } else {
            switchPass(false)
        }
    }
    // Form submittion handler
    function submitForm(e: any) {
        e.preventDefault()
        
        ValidateForm()

        if(e.currentTarget.classList.contains('was-validated')){
            const formData = new FormData(e.currentTarget)
            formData.append('uid', isUser.uid)

            let bodyData = {}
            formData.forEach((a:any,b:any) => {
                bodyData = {...bodyData, [b]: a}
            })

            fetch('/api/userinfo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({...bodyData})
            }).then((res: any) => {
                if(res.status !== 200) setError(true)
                return res.json()
            }).then((data) => {
                
                if(data.message) {
                    setErrorMessage({msg: data.message , atype: 'alert-success'})
                    setTimeout(() => setErrorMessage(), 5000)
                }
                if(data.error) {
                    setErrorMessage({msg: data.error , atype: 'alert-danger'})
                    setTimeout(() => setErrorMessage(), 5000)
                }
                
            })
        }
    }
    
    

    return (
        <div className={styles.pagesContent}>
            {
                errorMessage  && <ErrorAlert setShow={errorMessage ? true : false} msg={errorMessage!.msg} atype={errorMessage!.atype} />
            }
            <div className={styles.pagesContainer_1}>
                User Settings
            </div>
            <div className={styles.pagesContainer_2}>
                <h4>User Info</h4>
                <form onSubmit={submitForm} className={`row g-0 needs-validation`} noValidate>
                <div className={styles.pagesContainer_1}>
                    <div className={styles.settingsImageFrame}>
                        { isUser.img ? <UserImage setUser={setUser} isUser={isUser} updateImage={updateImage} setUpdateImage={setUpdateImage}/> : null }
                        <label htmlFor="userImage" onClick={selectFile} className={`form-label ${styles.changeImage}`}><BsIcons.BsCameraFill /> </label>
                    </div>
                    <input ref={hiddenInput} onChange={selectedImage} className={`form-control form-control-md ${styles.fileSelect}`} id="userImage" type="file"  accept={'image/x-png,image/jpg,image/jpeg,image/svg,image/webp'} hidden />
                </div>
                    <div className={styles.pagesContainer_1}>
                    <div className={`input-group`}>
                        <div className={`form-floating`}>
                            <input className={`form-control form-control-sm`} onChange={formUpdate} placeholder={getElm('uname')} type="text" id={'uname'} name={'uname'} defaultValue={isUser.uname} style={{boxShadow:'none', outline:'none', background:'transparent',border:'0 0 0 1px solid white'}} autoComplete="disabled"  disabled/>
                            <label className={`input-label`} htmlFor={'uname'}>{getElm('uname')}</label>
                        </div>
                    </div>
                    <div className={`input-group`}>
                        <div className={`form-floating`}>
                            <input className={`form-control form-control-sm`} onChange={formUpdate} placeholder={getElm('fname')} type="text" id={'fname'} name={'fname'} defaultValue={isUser.fname} style={{boxShadow:'none', outline:'none', background:'transparent',border:'0 0 0 1px solid white'}} autoComplete="disabled" required />
                            <label className={`input-label`} htmlFor={'fname'}>{getElm('fname')}</label>
                            <div className="invalid-feedback">
                                Please provide a valid name.
                            </div>
                        </div>
                        <div className={`form-floating`}>
                            <input className={`form-control form-control-sm`} onChange={formUpdate} placeholder={getElm('lname')} type="text" id={'lname'} name={'lname'} defaultValue={isUser.lname} style={{boxShadow:'none', outline:'none', background:'transparent',border:'0 0 0 1px solid white'}} autoComplete="disabled" required />
                            <label className={`input-label`} htmlFor={'lname'}>{getElm('lname')}</label>
                            <div className="invalid-feedback">
                                Please provide a valid name.
                            </div>
                        </div>
                    </div>
                    </div>
                    <div className={`input-group`}>
                        <div className={`form-floating`}>
                            <input className={`form-control form-control-sm`} onChange={formUpdate} placeholder={getElm('email')} type="text" id={'email'} name={'email'} defaultValue={isUser.email} style={{boxShadow:'none', outline:'none', background:'transparent',border:'0 0 0 1px solid white'}} autoComplete="disabled" required />
                            <label className={`input-label`} htmlFor={'email'}>{getElm('email')}</label>
                            <div className="invalid-feedback">
                                Please provide a valid Email address.
                            </div>
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
                                    <input className={`form-control form-control-sm `} onChange={formUpdate} placeholder={'Old Password'} type="password" id={'upass'} name={'upass'} style={{boxShadow:'none', outline:'none', background:'transparent',borderBottom:'1px solid white'}} required/>
                                    <label className={`input-label`} htmlFor={'upass'}>{'Old Password'}</label>
                                    <div className="invalid-feedback">
                                        Enter your old password.
                                    </div>
                                </div>
                            </div>
                            <div className={`input-group`}>
                                <div className={`form-floating`}>
                                    <input ref={newPass1} className={`form-control form-control-sm`} onChange={formUpdate} placeholder={'New Password'} type="password" id={'newpass'} name={'newpass'} style={{boxShadow:'none', outline:'none', background:'transparent',borderBottom:'1px solid white'}} required/>
                                    <label className={`input-label`} htmlFor={'newpass'}>{'New Password'}</label>
                                    <div className="invalid-feedback">
                                        {err ? `Password does not match` : `Enter your new password.`}
                                    </div>
                                </div>
                                <div className={`form-floating`}>
                                    <input ref={newPass2} className={`form-control form-control-sm`} onChange={formUpdate} placeholder={'Confirm new password'} type="password" id={'pass2'} name={'pass2'}  style={{boxShadow:'none', outline:'none', background:'transparent',borderBottom:'1px solid white'}} required/>
                                    <label className={`input-label`} htmlFor={'pass2'}>{'Confirm password'}</label>
                                    <div className="invalid-feedback">
                                        Confirm your new password.
                                    </div>
                                </div>
                            </div></>)
                            : null
                        }
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