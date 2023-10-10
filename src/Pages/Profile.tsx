import { User, getAuth } from "firebase/auth"
import { useState, useEffect } from "react"


const Profile = () => { 

  const [user, setUser] = useState< User | null>(null)

  const auth = getAuth()
  useEffect(()=>{
    console.log(auth.currentUser);
    
    setUser(auth.currentUser)
  },[])
  return user ? <h1>{user.displayName}</h1> : 'Not logged in'
}
export default Profile