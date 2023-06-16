import styles from '@/app/styles/profile.module.css'
import * as BsIcons from 'react-icons/bs';
import * as FaIcons from 'react-icons/fa';
import TopNav from '@/components/dash/topnav';
import Today from '@/components/dash/today';
import Plans from '@/components/dash/tasks';
import { CreaetPlan } from './plans';
import { Settings } from './Settings';
import { Support } from './support';

export default function DashPage({PageInfo, isUser, setUser}: any) {
    
    return (
        <div className={styles.pages}>
            <TopNav PageInfo={PageInfo} />
            {
                PageInfo.tree 
                ? PageInfo.tree == 'today' 
                    ? (<Today />)
                    : PageInfo.tree == 'tasks'
                        ? (<Plans />) 
                        : PageInfo.tree == 'subs'
                            ? (<CreaetPlan />)
                            : PageInfo.tree == 'settings'
                                ? (<Settings isUser={isUser} setUser={setUser}/>)
                                : PageInfo.tree == 'support'
                                    ? (<Support isUser={isUser} />)
                                    : PageInfo.tree == 'mail'
                                        ? (<>Mailing system</>)
                                        : PageInfo.tree == 'bills'
                                        ? (<>Billing System</>)
                                        : PageInfo.tree == 'users'
                                        ? (<>Users List</>)
                                        : PageInfo.tree == 'admin'
                                        ? (<>Administrator</>)
                                        : (<CreaetPlan />)
                : (<><div className={styles.pagesContent}>
                    <div className={styles.pagesContainer}>
                        <div className={styles.userGraph}>
                            <div className={styles.graphTab}>
                                <FaIcons.FaRegChartBar className={styles.graphIcon} style={{fontSize: '1rem'}} />
                                <div>Fitness App</div>
                            </div>
                        </div>
                        <div className={styles.graphTitle}>
                            <p style={{marginBottom: '0',marginTop: '0'}}>Data Description</p>
                        </div>
                    </div>
                </div>
                
                <div className={styles.pagesContent}>
                    <div className={styles.pagesContainer_1}>
                        <div className={styles.sectionContent}>
                            You&apos;re Data show up here
                        </div>
                    </div>
                </div></>)
            }

        </div>
    )
}
