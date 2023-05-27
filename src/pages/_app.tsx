import 'bootstrap/dist/css/bootstrap.css'
import '../app/styles/style.css'
import type { AppProps } from 'next/app'
import { useEffect } from "react";
import { useRouter} from  'next/router'
import { Roboto } from '@next/font/google'
import { CookiesProvider } from 'react-cookie';
import 'react-datepicker/dist/react-datepicker-cssmodules.css';

const roboto = Roboto({
  variable: '--roboto-font',
  weight: ['300','700','900'],
  subsets: ['latin']
})

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
    require('react-datepicker/dist/react-datepicker-cssmodules.css');
    require("react-datepicker/dist/react-datepicker.css");
  }, []);

  return (
    <CookiesProvider>
      <Component key={router.asPath} {...pageProps} />
    </CookiesProvider>
  )
}

