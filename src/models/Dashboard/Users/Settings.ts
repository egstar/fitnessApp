import { User, uSession } from "@/data/types";

export const useUser = async(e: any) => {
    e.preventDefault()
    if(!e){
        return { }
    }
    const userInput = {
        user: e.currentTarget.user.value as string,
        upass: e.currentTarget.upass.value as string
    }
    const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userInput)
    })
    if(res.status !== 200){
        throw new Error(await res.json())
    }
    const thisUser: User = await res.json()
    
    console.log(thisUser)

}
