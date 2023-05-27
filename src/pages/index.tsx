import * as FaIcons from 'react-icons/fa';
import Image from "next/image"
import * as bsIcons from 'react-icons/bs';
import * as faIcons from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import { Roboto } from '@next/font/google'
import {useCookies} from 'react-cookie'
import Link from 'next/link';
import ValidateForm from '@/models/FormValidation';
import styles from '@/app/styles/profile.module.css'
export const uToken: string = "tfindothekmissingehiddenn"
export const roboto = Roboto({
    variable: '--roboto-font',
    weight: ['300','700','900'],
    subsets: ['latin']
})


const Index = () => {
  const router = useRouter()
  const [myUser, setUser] = useState({})
  const [userNull, setNullUser] = useState(false)
  const [cookies, setCookie, removeCookie] = useCookies([uToken]);
  const [menu, setMenu] = useState({href: '#login',toggle: true,modal: true}) as any
  
const loginHandler = (e: any) => {
  e.preventDefault()
  ValidateForm()
  const userInput = {
    user: e.currentTarget.user.value as string,
    upass: e.currentTarget.upass.value as string
  }
  setUser(userInput)
  setNullUser(true)
}
  useEffect(() => {
    if(userNull){
    fetch('/api/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(myUser)
    })
    .then((res) => {
      if(res.status !== 200){
        throw new Error(`${res.json()}`)
      }
      return res.json()
    })
    .then((data) => {
      setCookie(data.cookie.split('=')[0], data.cookie.split('=')[1].split(';')[0], {
        path:'/'
      })
      router.prefetch('/dash/[index]')
      window.location.href = '/dash/home'
      
    })
    setNullUser(false)
  }
}, [myUser])
useEffect(() => {
cookies! && cookies[uToken] ? setMenu({href: '/dash/home',toggle: false,modal: false,text: 'Dashboard'}) : setMenu({href: '#login',toggle: true,modal: true, text: 'Login'})
}, [])
const signOut = () => {
  fetch('/api/signout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  }).then((res) => {
    removeCookie(uToken)
  })
}
    return (
      <main className={`${roboto.className}`}>
        <header>
            <nav className="navbar fixed-top navbar-expand-lg">
                <div className="container-fluid w-100">
                  <a className="navbar-brand me-5" href="#">
                    <Image className='logo-head'
                        src='/assets/spec/head.jpg'
                        width={215.467}
                        height={48}
                        alt={`Fitness App`}
                         />
                  </a>
                  <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                  </button>
                  <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-1 mb-2 mb-lg-0">
                      <li className="nav-item">
                        <Link className="nav-link active" aria-current="page" href="/"><FaIcons.FaHome style={{fontSize:'1.5rem'}} /></Link>
                      </li>
                      <li className="nav-item dropdown">
                        <Link className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                          Menu
                        </Link>
                        <ul className="dropdown-menu">
                          <li><Link className="dropdown-item" href={menu.href} data-bs-toggle={menu.modal ? "modal" : ""} data-bs-target={menu.toggle ? "#login" : ""}>{menu.text}</Link></li>
                        </ul>
                      </li>
                    </ul>
                    <form className="d-flex" role="search">
                      <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                      <button className="btn btn-outline-secondary" type="submit">Search</button>
                    </form>
                  </div>
                </div>
              </nav>
        </header>
        
        <div className="page-content">
            <div className="main container">
                <div className="row g-0">
                    <div className="col-md-4">
                        <div className="left-side">
                            <Image className="main-logo"
                            src="/assets/spec/Logo.jpg"
                            width={355.233}
                            height={355.233}
                            alt="Fitness App" />
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className="right-side">
                            <div className="right-top">
                                <h1>Welcome to the Fitness App</h1>
                                <h2>Our platform is ranked as No. <sup>#1</sup> in our area</h2>
                            </div>
                            <div className="right-info">
                                <h3>For more information, you can check</h3> <div className="plans-button">Our Plans</div>
                            </div>
                            {
                              menu.toggle ?
                                (<div className="sign-user">
                                    You can <a href="#login" data-bs-toggle="modal" data-bs-target="#login">Login</a> to your account, or <a href="#signup" data-bs-toggle="modal" data-bs-target="#signup">Sign up</a> for a new one
                                    <div className="signin-user">
                                        <div className="modal fade" id="login" tabIndex={-1} aria-labelledby="loginmodal" aria-hidden="true">
                                            <div className="modal-dialog">
                                              <div className="modal-content">
                                                <div className="modal-body">
                                                  <div className="login-header">
                                                    Login
                                                  </div>
                                                  <div className="login-form">
                                                    <form className="row g-0 needs-validation" onSubmit={loginHandler} noValidate>
                                                        <div className="input-group mb-3 userdetails">
                                                          <span className="input-group-text eyeslash"><bsIcons.BsEnvelope /></span>
                                                            <div className="form-floating">
                                                                <input type="text" className="form-control" name="user" id="user" placeholder="E-mail/Username" required />
                                                                <label htmlFor="user">E-mail</label>
                                                            </div>
                                                            
                                                        </div>
                                                        <div className="input-group mb-3 userdetails">
                                                        <span className="input-group-text eyeslash"><faIcons.FaStarOfLife /></span>
                                                            <div className="form-floating">
                                                                <input type="password" className="form-control" name="upass" id="upass" placeholder="Password" required />
                                                                <label htmlFor="upass">Password</label>
                                                            </div>
                                                            
                                                        </div>
                                                        <div className="col-12">
                                                            <button type="submit" className="lgbtn">Login</button>
                                                        </div>
                                                        <span className="pass-forget"><a href="#forget?">Forget password?</a></span>
                                                    </form>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                    </div>
                                    <div className="signup-user">
                                        
                                        <div className="modal fade" id="signup" tabIndex={-1} aria-labelledby="signupmodal" aria-hidden="true">
                                            <div className="modal-dialog">
                                              <div className="modal-content">
                                                <div className="modal-body">
                                                  <div className="login-header">
                                                    Sign up
                                                  </div>
                                                  <div className="login-form">
                                                    <form id="signupform" className="row g-0 needs-validation" action="/api/signup" method="post" noValidate>
                                                        <div className="input-group mb-3">
                                                        <span className="input-group-text"><faIcons.FaUserAlt /></span>
                                                            <div className="form-floating">
                                                                <input type="text" className="form-control" name="uname" id="uname" placeholder="Username" required />
                                                                <label htmlFor="uname">Username</label>
                                                            </div>
                                                        </div>
                                                        <div className="input-group mb-3">
                                                            <span className="input-group-text eyeslash"><bsIcons.BsFillPersonLinesFill /></span>
                                                            <div className="form-floating">
                                                                <input type="text" className="form-control" name="fname" id="fname" placeholder="First name" required />
                                                                <label htmlFor="fname">First name</label>
                                                            </div>
                                                            <div className="form-floating">
                                                                <input type="text" className="form-control" name="lname" id="lname" placeholder="Last name" required />
                                                                <label htmlFor="lname">Last name</label>
                                                            </div>
                                                        </div>
                                                        <div className="input-group mb-3">
                                                            <span className="input-group-text eyeslash"><bsIcons.BsEnvelope /></span>
                                                            <div className="form-floating">
                                                                <input type="email" className="form-control" name="email" id="email" placeholder="E-mail" required />
                                                                <label htmlFor="email">E-mail</label>
                                                            </div>
                                                        </div>
                                                        <div className="input-group mb-3">
                                                        <span className="input-group-text eyeslash"><faIcons.FaStarOfLife /></span>
                                                            <div className="form-floating">
                                                                <input type="password" className="form-control" name="userpass" id="userpass" placeholder="Password" required />
                                                                <label htmlFor="userpass">Password</label>
                                                            </div>
                                                            <div className="form-floating">
                                                                <input type="password" className="form-control mx-1" id="userpass2" placeholder="Password2" required />
                                                                <label htmlFor="userpass2">Confirm Password</label>
                                                            </div>
                                                            
                                                        </div>
                                                        <div className="col-12">
                                                            <div className="form-check terms-check">
                                                              <input className="form-check-input" type="checkbox" value="true" id="invalidCheck" required />
                                                              <label className="form-check-label" htmlFor="invalidCheck">
                                                                I had read all <a href="#terms">Terms & conditions</a>, and i accept it.
                                                              </label>
                                                              <div className="invalid-feedback">
                                                                You must agree before submitting.
                                                              </div>
                                                            </div>
                                                          </div>
                                                          
                                                        <div className="col-12">
                                                            <button type="submit" className="lgbtn">Sign up</button>
                                                        </div>
                                                    </form>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>


                                    </div>
                                </div>)
                                : (<div className={styles.signOut}>You can access your <Link href={'/dash/home'}> Dashboard</Link> or <Link href="#signout" onClick={signOut}>Signout</Link></div>)
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <footer>
            <div className="footer fixed-bottom">
                    Testing mode &copy; Burham Soliman
            </div>
        </footer>
      </main>
    )
}

export default Index;