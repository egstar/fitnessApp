import styles from '@/app/styles/profile.module.css'
import * as BsIcons from 'react-icons/bs';
import * as FaIcons from 'react-icons/fa';
import { IconType } from 'react-icons/lib';
import { MenuItem, PgInfo } from '@/data/types';
import Link from 'next/link';
import { useState, useEffect } from 'react'
import LoadingSpinner from '../Loading';
import { UserImage } from './userImage';




const SideMenu = ({index, setIndex, setData, data, setPage, PageInfo, isActive, setActive, isUser, tabHandler, setUser}: any) => {
            
    return (
        <div className={styles.sideBar}>
                <div className={styles.userTop}>
                    <div className={styles.imageFrame} data-user={isUser? isUser.fname + ' ' + isUser.lname : null}>
                        <UserImage setUser={setUser} isUser={isUser} />
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
                    { data.map((elm: MenuItem, index:number) => {
                        let IconCat: string = elm.logo.split('.')[0] as string
                        let Icon: string = elm.logo.split('.')[1]
                        let Logo: IconType = FaIcons["FaArrowCircleRight"]
                        if(IconCat == 'FaIcons'){
                            Logo = FaIcons[Icon as keyof IconType]
                        } else {
                            Logo = BsIcons[Icon as keyof IconType]

                        }
                        return (
                            <div key={index}>
                            {
                                elm.sub
                                ? (
                                    <div key={elm.id} className={`accodion`} id={`menu${elm.id}`}>
                                        <div className={`accordion-item`}>
                                            <h2 className="accordion-header" id={`menuHead${elm.id}`} style={{textAlign:'center'}}>
                                                <li className={`accordion-button ${styles.option} ${PageInfo.subParent && PageInfo.subParent == elm.id? styles.activeOptionParent :null}`} style={{boxShadow:'none',fontSize: '1.7vw', height:'max-content',textAlign:'center'}} data-bs-toggle="collapse" data-bs-target={`#menu${elm.id}Body`} aria-expanded="true" aria-controls={`menu${elm.id}Body`}>
                                                    <Logo className={styles.sideIcons} />
                                                    <p>{elm.opt}</p>
                                                </li>
                                            </h2>
                                            <div id={`menu${elm.id}Body`} className={`accordion-collapse collapse ${index == 0 ? 'show' : null}`} aria-labelledby={`menuHead${elm.id}`} data-bs-parent={`#menu${elm.id}`}>
                                                <div className={`accordion-body`} style={{background:'#b69ca9',borderTop:'3px solid #583b63'}}>
                                                        {
                                                            elm.sub.map((sub: any, index:number) => {
                                                                return (
                                                                    <Link data-sub={true} key={sub.id} href={`/dash/${sub.tree}`} onClick={(e) => tabHandler(e)} className={`${styles.option}`} style={{ textDecoration: 'none', color: '#f2bdae' }} >
                                                                         <li className={`${styles.option} ${PageInfo.sub && isActive == sub.id ? styles.activeOption : null}`}>
                                                                            <FaIcons.FaArrowRight />
                                                                            <p>{sub.sub}</p>
                                                                        </li>
                                                                    </Link>
                                                                )
                                                            })
                                                        }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                                : (
                                    <Link key={elm.id} href={`${elm.url}`} onClick={(e) => tabHandler(e)} style={{ textDecoration: 'none', color: '#f2bdae' }}>
                                        <li className={`${styles.option} ${!PageInfo.sub && isActive == elm.id? styles.activeOption:null}`}>
                                            <Logo className={styles.sideIcons} />
                                            <p>{elm.opt}</p>
                                        </li>
                                    </Link>
                                )
                            }
                            </div>
                        )
                    }
                    )}
                </ul>
            </div>
    )
}
export default SideMenu;