import styles from '@/app/styles/profile.module.css'
import * as BsIcons from 'react-icons/bs'
import { useEffect, useRef, useState } from 'react'
import { ErrorAlert } from "@/components/Error"
import { useRouter } from 'next/router'


export const AdminUsers = ({isUser, setLoading, isLoading}: any) => {
    const router = useRouter()
    const [usersList, setUsersList]= useState() as any  // User's List
    const [errorMessage, setErrorMessage ] = useState() as any
    const [err, setError] = useState(false)
    const [refresh, setRefresh] = useState(false) // Reload user's list
    const [userAction, setUserAction] =useState() as any
    const [shownPass, setShownPass] = useState(false)
    const [newUserLevel, setNewUserLevel] = useState() as any
    const passField = useRef() as any
    const actModal = useRef() as any
    const swconfirm= useRef() as any
    const [newpass, setNewPass] = useState('') as any
    useEffect(() => {
        if(!isUser || !usersList) setLoading(true)
    },[isUser,!usersList])
    const getUserList = () => fetch('/api/users', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    }).then((res) => {
        if(res.status != 200) setError(true)
        return res.json()
    }).then((data) => {
        if(data.error){
            if(data.error == "Only admins are premitted to do this action") router.reload()
            setErrorMessage({msg:data.error,atype:'alert-danger'})
            setTimeout(() => setErrorMessage(), 5000)
        } else {
            setUsersList(data)
        }
    })
    useEffect(() => {
        if(!errorMessage) setError(false)
    },[errorMessage])
    useEffect(() => {
        if(refresh) {
            getUserList()
            setRefresh(false)
        }
    },[refresh])

    useEffect(() => {
        getUserList()
    },[])
    useEffect(() => {

        if(!err) setLoading(false)
    },[usersList,err])

    function newPass(e: any) {
        setNewPass(e.currentTarget.value)
    }
    function chgUserPass(e: any){
        e.preventDefault()
        const uInfo ={uid: e.currentTarget.dataset['uid'],uname: e.currentTarget.dataset['uname']}
        setUserAction({uid: uInfo.uid,uname:uInfo.uname,action:'chPass',newpass})    
    }
    function delUser(e: any){
        e.preventDefault()
        const uInfo ={uid: e.currentTarget.dataset['uid'],uname: e.currentTarget.dataset['uname']}
        setUserAction({uid: uInfo.uid,uname:uInfo.uname,action:'delUser'})
        
    }
    function chPassForm(e: any){
        e.preventDefault()
        fetch('/api/users/userp',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            credentials:'include',
            body: JSON.stringify({uid: userAction.uid,newpass})
        }).then((res) => res.json()).then((data) =>{
            if(data.message){
                setErrorMessage({msg:data.message,atype:'alert-success'})
                setTimeout(() => setErrorMessage(), 5000)
                const mdlBtn = document.querySelector('#modalClose') as unknown as any
                mdlBtn.click()
            } else if(data.error){
                setErrorMessage({msg:data.error,atype:'alert-danger'})
                setTimeout(() => setErrorMessage(), 5000)
            }

        })

    }
    function showPass(e: any){
        e.currentTarget.focus()
        setShownPass(!shownPass)
    }
    function chgLevel(e: any) {
        console.log(e.currentTarget.dataset['uname'],' ', e.currentTarget.dataset['lvl'],' ',e.currentTarget.value)
        if(e.currentTarget.dataset['lvl'] != e.currentTarget.value){
            setNewUserLevel({uid: e.currentTarget.dataset['uid'], uname: e.currentTarget.dataset['uname'], lvl: e.currentTarget.value})
            
        }
    }
    async function setNewLevel(e: any){
        await fetch('/api/users/userl', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
            },
            credentials:'include',
            body: JSON.stringify({uid: newUserLevel.uid, newlvl: newUserLevel.lvl})
        }).then((res) => res.json()).then((data) => {
            if(data.message){
                setErrorMessage({msg:data.message,atype:'alert-success'})
                setNewUserLevel()
                setTimeout(() => setErrorMessage(), 5000)
            } else if(data.error){
                setErrorMessage({msg:data.error,atype:'alert-danger'})
                setNewUserLevel()
                setTimeout(() => setErrorMessage(), 5000)
            }
        })
    }
    async function endSession(e: any){
        

    }
    
    return(
        <div className={`${styles.pagesContent}`}>
            {
                errorMessage  && <ErrorAlert setShow={errorMessage ? true : false} msg={errorMessage!.msg} atype={errorMessage!.atype} />
            }
            {
                newUserLevel && 
                <div className="toast-container position-fixed top-50 start-50 translate-middle">
                    
                    <div ref={swconfirm} id={'liveToast'} className="toast align-items-center show" role="alert" aria-live="assertive" aria-atomic="true">
                        <div className="d-flex">
                            <div className="toast-body w-100">
                                <p>Change user {newUserLevel.uname} level to {newUserLevel.lvl == 4 ? 'CEO' : newUserLevel.lvl == 3 ? 'Admin' : newUserLevel.lvl == 2 ? 'Trainer' : 'Trainee'} ?</p>
                                <div className={`btn btn-sm btn-secondary`} onClick={() => setNewUserLevel()}>Cancel</div> | <div className={`btn btn-sm btn-success`} onClick={setNewLevel}>Yes</div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            }
            <div ref={actModal} className={`modal modal-sm fade`} id="actionmodal" tabIndex={-1} aria-labelledby="aModalLabel" aria-hidden="true">
                <div className={`modal-dialog`}>
                {userAction && <div className={`modal-content`}>
                        <div className={`modal-header`}>
                            <h5 className={`modal-title fs-6`} id="aModalLabel">{userAction.action == 'chPass' ? 'Change password of ' : 'Delete user '} <span style={{textDecoration:'underline',color:'lightgray'}}>{userAction.uname}</span></h5>
                            <button id="modalClose" type="button" className={`btn-close`} data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className={`modal-body`}>
                            <div className={``}>
                                {
                                    userAction.action == 'chPass' && <form onSubmit={chPassForm} data-uid={userAction.uid}>
                                        <div className={`input-group`}>
                                            <div className={`form-floating`}>
                                                <input onChange={newPass} ref={passField} type={shownPass ? 'text' : 'password'} className={`form-control form-control-sm`} name={'newpass'} id={'newpass'} style={{boxShadow:'none',outline:'none',border:'none',background:'white',color:'black'}} required autoComplete='false'/>
                                                <label className={`input-label`} htmlFor={'newpass'} style={{color:'black'}}>Change password</label>
                                                <span onClick={showPass} className={`${styles.checkEye}`}>{!shownPass ? <BsIcons.BsEye /> : <BsIcons.BsEyeSlash />}</span>
                                                <div className={`invalid-feedback`}>
                                                    Please provide a valid name.
                                                </div>
                                            </div>
                                            <input type='submit' className={`btn btn-outline-success btn-sm ${styles.submitButton}`} name='Update' value={`Change`} />
                                        </div>
                                    </form>
                                    ||
                                    userAction.action == 'delUser' && <div className={`${styles.deleteUser}`}> <span>{'Are you sure you want to delete user '}</span><span style={{color:'lightcoral',border:'1px solid white',borderRadius:'5px',padding:'.5rem'}}>{userAction.uname}</span><div className={``} style={{marginTop:'.5rem',display:'flex',justifyContent:'space-between'}}><span className={`btn btn-sm btn-danger`}>Delete</span><span className={`btn btn-sm btn-secondary`}  data-bs-dismiss="modal" aria-label="Close">Cancel</span></div></div>
                                }
                            </div>
                        </div>
                    </div>}
                </div>
            </div>
            
            <div className={`${styles.pagesContainer_1}`} style={{overflow:'auto'}}>
                <div className={``}>User&apos;s List</div>
                <table className={`table  table-sm table-striped-columns overflow-auto ${styles.userTableContainer}`} style={{borderTop:'3px solid #583b63', overflow:'auto', maxHeight:'50vh',margin:0,padding:0}}>
                    <thead className={`${styles.tableHead}`}>
                        <tr>
                            <th scope={`col`} colSpan={1}>ID</th>
                            <th scope={`col`} colSpan={1}>Username</th>
                            <th scope={`col`} colSpan={1}>Full name</th>
                            <th scope={`col`} colSpan={1}>Email</th>
                            <th scope={`col`} colSpan={1}>User Level</th>
                            <th scope={`col`} colSpan={1}>Active Session</th>
                            <th scope={`col`} colSpan={1}>Registered At</th>
                            <th scope={'col'} colSpan={1}>Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            isUser && usersList && usersList.map((usr: any, index:number) => {
                                return(
                                    <tr key={index} className={`${styles.usersDetails} ${Number(isUser.uid) === Number(usr.uid) ? styles.myUser : null}`}>
                                        <td className={``}>
                                            {usr.uid}
                                        </td>
                                        <td className={``}>
                                            {usr.uname}
                                        </td>
                                        <td className={``} title={usr.fname+ ' '+ usr.lname}>
                                            {usr.fname+ ' '+ usr.lname}
                                        </td>
                                        <td className={``} title={usr.email}>
                                            {usr.email}
                                        </td>
                                        <td className={``} title={usr.lid == 4 ? 'CEO' : usr.lid == 3 ? 'Admin' : usr.lid == 2 ? 'Trainer' : 'Trainee'}>
                                            <select onChange={chgLevel} data-uid={usr.uid} data-uname={usr.uname} data-lvl={usr.lid} className={`form-select form-select-sm ${styles.lvlSelect}`} defaultValue={usr.lid} disabled={
                                                isUser.lid < 4
                                                    ? isUser.uid === usr.uid 
                                                        ? true 
                                                        : isUser.lid <= usr.lid 
                                                            ? true 
                                                            : isUser.lid < 4 && usr.lid > 3 
                                                                ? true 
                                                                : false 
                                                    : false
                                            }>
                                                <option value={1}>Trainee</option>
                                                <option value={2}>Trainer</option>
                                                <option value={3}>Admin</option>
                                                <option value={4} disabled={isUser.lid < 4 ? true : false}>CEO</option>
                                            </select>
                                        </td>
                                        <td className={``}>
                                            {usr.sid && new Date(usr.sexpiry) > new Date() 
                                            ?  (<div data-uid={usr.uid} className={`btn btn-sm  ${isUser.uid == usr.uid ? null : styles.killSession}`} onClick={endSession}>
                                                    <span className={`${styles.sessionExp}`}>{new Date(usr.sexpiry).toLocaleString('en-UK',{day:'2-digit',month:'2-digit',formatMatcher:'best fit'}) + ' ' + new Date(usr.sexpiry).toLocaleString('en-UK',{timeStyle:'short'})}</span>
                                                    <BsIcons.BsXCircle className={`${styles.stopSign}`} />
                                                </div>)
                                            : '-'}
                                        </td>
                                        <td className={``} title={new Date(usr.regdate).toLocaleString('en-UK')}>
                                            {new Date(usr.regdate).toLocaleString('en-UK', {weekday:'short',day:'2-digit',month:'short',year:'numeric'})}
                                        </td>
                                        <td className={``}>
                                            <span data-bs-toggle={isUser.uid === usr.uid ? null : isUser.lid <= usr.lid ? null : "modal"} data-bs-target="#actionmodal" onClick={(e) => isUser.uid === usr.uid ? null : isUser.lid <= usr.lid ? null : isUser.lid < 4 ? null : chgUserPass(e)} data-uid={usr.uid} data-uname={usr.uname} className={`btn btn-sm btn-secondary`} title={'Change password'}><BsIcons.BsShieldLock /> </span>
                                            <span data-bs-toggle={isUser.uid === usr.uid ? null : isUser.lid <= usr.lid ? null : "modal"} data-bs-target="#actionmodal" onClick={(e) => isUser.uid === usr.uid ? null : isUser.lid <= usr.lid ? null : isUser.lid < 4 ? null : delUser(e)} data-uid={usr.uid} data-uname={usr.uname} className={`btn btn-sm btn-danger`} title={'Delete user'} style={{marginLeft:'5px'}}><BsIcons.BsX /> </span>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}