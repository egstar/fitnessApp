import 'bootstrap/dist/css/bootstrap.css'
import '../app/styles/style.css'
import type { AppProps } from 'next/app'
import { useState, useEffect } from "react";
import { useRouter} from  'next/router'
import { Roboto } from '@next/font/google'
import { CookiesProvider } from 'react-cookie';
import { useCookies } from 'react-cookie'
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import { User } from '@/data/types';

export const uToken: string = "tfindothekmissingehiddenn"
const roboto = Roboto({
  variable: '--roboto-font',
  weight: ['300','700','900'],
  subsets: ['latin']
})


export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [isLogged, setLogged] = useState(false)
  const [fetcherror, setFetchError] = useState(false)
  const [cookies, setCookie, removeCookie] = useCookies([uToken]);
  const [isUser, setUser] = useState({} as User)
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
    require('react-datepicker/dist/react-datepicker-cssmodules.css');
    require("react-datepicker/dist/react-datepicker.css");
  }, []);

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
            if(res.status !== 200 ) {
                setFetchError(true) 
                return {error: res.json()}
            }
            return res.json()
        }).then((data) => {
            if(data.error) {
                removeCookie(uToken)
                setLogged(false)
                router.replace('/')
            } else {
              if(isUser != data) setUser(data)
              setLogged(true)
            }
        })
    }
}, [cookies])

useEffect(() => {
  if( fetcherror && cookies[uToken] && isLogged === false) {
    removeCookie(uToken, {
    path: '/'
  })
  }
},[isLogged])


  return (
    <CookiesProvider>
      <Component style={roboto} key={router.asPath} {...pageProps} isUser={isUser} isLogged={isLogged} setUser={setUser} setLogged={setLogged} cookies={cookies} setCookie={setCookie} removeCookie={removeCookie} />
    </CookiesProvider>
  )
}

