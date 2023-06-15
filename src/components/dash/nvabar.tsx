import styles from '@/app/styles/profile.module.css'
import { uToken } from '@/pages';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCookies } from 'react-cookie';
import * as FaIcons from 'react-icons/fa';

const DashNav = ({isUser}: any) => {
    const [cookies, setCookies, removeCookies] = useCookies([uToken])
    const router = useRouter()
    const SignOut = (e: any) => {
        e.preventDefault();
        fetch('/api/signout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({uid: isUser.uid})
        }).then((res) => {
            removeCookies(uToken, {
                path: '/'
              })
            router.replace('/')
        })
    }
    return (
        <div className={styles.navBar}>
                <div className={styles.searchBox}>
                    <span className={styles.searchIcon}>
                        <p><FaIcons.FaSearch /></p>
                    </span>
                    <form className={styles.searchForm} method="POST" action="">
                        <input className={styles.searchBar} placeholder={`Search for ...`}type="text" />
                    </form>
                </div>
                <div className={styles.navOptions}>
                        <div className={styles.userButtons}>
                            <Link href={`/dash/settings`} className={styles.userOptions}><FaIcons.FaCog /></Link>
                            <p className={styles.signOut} onClick={(e) => SignOut(e)}><FaIcons.FaPowerOff /></p>
                        </div>
                </div>
            </div>
    )
}

export default DashNav;