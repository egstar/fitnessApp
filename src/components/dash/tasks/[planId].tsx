import { useRouter } from 'next/router'


const Plan = () => {
    const router = useRouter()
    const {planId} = router.query

    return (
        <>
            <h1 className="data-data">
                the user plans {planId}
            </h1>
        </>
    )
}

export default Plan;