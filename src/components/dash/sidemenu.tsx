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
    const [usrImage, setUsrImage] = useState('') as any
    const getImage = async()=> {
        const userImage = isUser.img ? isUser.img : `data:image/png;base64,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`
        const file = await fetch(userImage)
        const imgBlob = await file.blob()
        const usrImg = URL.createObjectURL(imgBlob)
        setUsrImage(usrImg)
    }

    useEffect(() => {
        getImage()
    }, [])
    if(isLoading) return (<LoadingSpinner />)
    
    return (
        <div className={styles.sideBar}>
                <div className={styles.userTop}>
                    <div className={styles.imageFrame} data-user={isUser? isUser.fname + ' ' + isUser.lname : null}>
                        <Image className={styles.userImage}
                        src={usrImage}
                        width={640}
                        height={640}
                        alt={isUser? isUser.fname + ' ' + isUser.lname : 'Profile Picture'}
                        />
                    </div>
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