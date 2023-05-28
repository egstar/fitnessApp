import styles from '@/app/styles/profile.module.css'
import * as BsIcons from 'react-icons/bs';
import * as FaIcons from 'react-icons/fa';
import Image from 'next/image';
import { IconType } from 'react-icons/lib';
import { MenuItem, PgInfo } from '@/data/types';
import Link from 'next/link';
import { useState, useEffect } from 'react'
import LoadingSpinner from '../Loading';




const SideMenu = ({index, setIndex, setData, data, setPage, isActive, setActive, isUser, tabHandler}: any) => {
    const [isLoading, setLoading] = useState(false)
    
    if(isLoading) return (<LoadingSpinner />)
    return (
        <div className={styles.sideBar}>
                <div className={styles.userTop}>
                    <div className={styles.imageFrame} data-user={isUser? isUser.fname + ' ' + isUser.lname : null}>
                        <Image className={styles.userImage}
                        src="/assets/imgs/usr.png"
                        width={640}
                        height={640}
                        alt={isUser? isUser.fname + ' ' + isUser.lname : 'Profile Picture'}
                        />
                        <span className={styles.uname}><div>{isUser? isUser.fname + ' ' + isUser.lname : null}</div></span>
                    </div>
                    <div className={styles.userName}>
                        <div className={styles.userTools}>
                            <span className={styles.usersInfo}>
                                <FaIcons.FaRegChartBar className={styles.infoLogo}/>
                                <i>{` 100k + `}</i>
                            </span>
                            <span className={styles.usersInfo}>
                                <FaIcons.FaUserShield className={styles.infoLogo} />
                                <i>{` ${isUser.level} `}</i>
                            </span>
                        </div>
                    </div>
                </div>

                <ul className={styles.sideMenu}>
                    { data.map((elm: MenuItem) => {
                        let IconCat: string = elm.logo.split('.')[0] as string
                        let Icon: string = elm.logo.split('.')[1]
                        let Logo: IconType = FaIcons["FaArrowCircleRight"]
                        if(IconCat == 'FaIcons'){
                            Logo = FaIcons[Icon as keyof IconType]
                        } else {
                            Logo = BsIcons[Icon as keyof IconType]

                        }

                        return (
                            <Link key={elm.id} href={`${elm.url}`} onClick={(e) => tabHandler(e)} style={{ textDecoration: 'none', color: 'powderblue' }}>
                                <li className={`${styles.option} ${isActive == elm.id? styles.activeOption:null}`}>

                                    <Logo className={styles.sideIcons} />
                                    <p>{elm.opt}</p>
                                </li>
                            </Link>
                        )
                    })}
                </ul>
            </div>

    )
}
export default SideMenu;