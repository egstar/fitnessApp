import styles from '../../app/styles/profile.module.css'
import * as FaIcons from 'react-icons/fa';


const TopNav = ({PageInfo}: any) => {
    const PathInfo = PageInfo
    let Ptree = PathInfo.tree ? PathInfo.tree.split('/') : ['home']
    return (
        <div className={styles.pagesTop} >
            <span className={styles.pagesHeader}>{PathInfo.page}</span>
            <div className={styles.pagesMap}>
                <a className={styles.homePage} href={`/`}><FaIcons.FaHome style={{marginRight:'0.75rem'}} /></a>
                {
                    Ptree.map((elm: string) => {
                        if(elm != Ptree[Ptree.length-1]) {
                            return ( <span key={elm}> / <span className={styles.homePage} style={{marginRight:'0.75rem'}}>{elm}</span></span> )
                        } else {
                            return ( <span key={elm}> / </span> )
                        }
                    })
                }
                <span className={styles.homePage}>{PathInfo.page}</span>
            </div>
        </div>
    )
}

export default TopNav;