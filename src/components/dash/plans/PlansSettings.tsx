import styles from '@/app/styles/profile.module.css'

export const PlanSettings = () => { 

    return (
        <>
            <div className={`${styles.planEditor}`}>
                <form className={`${styles.editForm}`}>
                    <input type='text' name={``} id={`editName`} />
                    <label htmlFor={`editName`}>Edit plan name</label>
                </form>
            </div>
        </>
    )
    
}