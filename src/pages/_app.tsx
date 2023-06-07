import 'bootstrap/dist/css/bootstrap.css'
import '../app/styles/style.css'
import type { AppProps } from 'next/app'
import { useState, useEffect } from "react";
import { useRouter} from  'next/router'
import { Roboto } from '@next/font/google'
import { CookiesProvider } from 'react-cookie';
import useSWR from 'swr';
import {useCookies} from 'react-cookie'
import 'react-datepicker/dist/react-datepicker-cssmodules.css';

export const uToken: string = "tfindothekmissingehiddenn"
const roboto = Roboto({
  variable: '--roboto-font',
  weight: ['300','700','900'],
  subsets: ['latin']
})




export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [isLogged, setLogged] = useState(true)
  const [cookies, setCookie, removeCookie] = useCookies([uToken]);
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
    require('react-datepicker/dist/react-datepicker-cssmodules.css');
    require("react-datepicker/dist/react-datepicker.css");
  }, []);
  useEffect(() => {
    fetch('/api/user', {
      method: 'POST',
      headers: {
        'Content-Type':'application/json'
      },
      credentials: 'include'
    }).then((res) => {
      if(res.status !== 200) {
        setLogged(false)
      }
      setLogged(true)
    })
  },[cookies])
  useEffect(() => {
    if( cookies[uToken] && isLogged == false) {
      removeCookie(uToken, {
      path: '/'
    })
    }
  },[isLogged])

  return (
    <CookiesProvider>
      <Component style={roboto} key={router.asPath} {...pageProps} />
    </CookiesProvider>
  )
}

