import * as BsIcons from 'react-icons/bs'
import {useEffect, useState} from 'react'

export const ErrorAlert = ({msg,atype,alertShow}: any) => {
    
    const [show, setShow] = useState(true)
    useEffect(() => {
        if(alertShow) setShow(true)
    },[alertShow])
    return (
        <div className={`alert ${atype} ${show ? 'show' : 'fade'} alert-dismissible d-flex align-items-center`} role="alert" style={{position:'fixed',margin:0,right:'1rem',top:'3rem',zIndex:999}}>
            <BsIcons.BsInfoCircleFill style={{marginRight:'0.5rem'}}/>
            <div>
            {` ${msg}`}
            </div>
            <button type="button" className="btn-sm btn-close" onClick={() => setShow(false)} aria-label="Close"></button>
        </div> 
    )
}