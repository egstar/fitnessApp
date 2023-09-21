import styles from '@/app/styles/profile.module.css'
import * as BsIcons from 'react-icons/bs';
import * as FaIcons from 'react-icons/fa';
import TopNav from '@/components/dash/topnav';
import Today from '@/components/dash/today';
import Plans from '@/components/dash/tasks';
import { CreaetPlan } from './plans';
import { Settings } from './Settings';
import { Support } from './support';
import { AdminUsers } from './admin/users';
import AdminSupport from './admin/support';




export default function DashPage({PageInfo, isUser, setUser, setLoading, isLoading}: any) {

    const Menu = ({Page}: any) => {
        const Pages:any = {
            'admin#users': <AdminUsers setLoading={setLoading} isLoading={isLoading} isUser={isUser} setUser={setUser} />,
            'admin#plans': null,
            'admin#menu': null,
            'admin#tasks': null,
            'admin#support': <AdminSupport setLoading={setLoading} isLoading={isLoading} isUser={isUser} setUser={setUser} />
        }
        
        return Pages[Page]
    }
    
    return (
        <div className={styles.pages}>
            <TopNav PageInfo={PageInfo} />
            {
                PageInfo.tree 
                ? PageInfo.tree == 'today' 
                    ? (<Today setLoading={setLoading} isLoading={isLoading} />)
                    : PageInfo.tree == 'tasks'
                        ? (<Plans  setLoading={setLoading} isLoading={isLoading}  />) 
                        : PageInfo.tree == 'subs'
                            ? (<CreaetPlan  setLoading={setLoading} isLoading={isLoading} />)
                            : PageInfo.tree == 'settings'
                                ? (<Settings  setLoading={setLoading} isLoading={isLoading} isUser={isUser} setUser={setUser}/>)
                                : PageInfo.tree == 'support'
                                    ? (<Support  setLoading={setLoading} isLoading={isLoading}  isUser={isUser} />)
                                    : PageInfo.tree == 'mail'
                                        ? (<>Mailing system</>)
                                        : PageInfo.tree == 'bills'
                                        ? (<>Billing System</>)
                                        : PageInfo.tree == 'users'
                                        ? (<>Users List</>)
                                        : PageInfo.tree && PageInfo.tree.includes('admin')
                                        ? (<Menu Page={PageInfo.tree} />)
                                        : (<CreaetPlan  setLoading={setLoading} isLoading={isLoading} />)
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
