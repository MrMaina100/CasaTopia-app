import { User, getAuth } from "firebase/auth"
import { useState, useEffect } from "react"
import Button from "../Components/Button"
import { useNavigate } from "react-router-dom"


const Profile = () => { 

  const [user, setUser] = useState< User | null>(null)
  const navigate = useNavigate()
  

  const auth = getAuth()
  useEffect(()=>{
        
    setUser(auth.currentUser)
  },[])

  const handleLogout = ()=>{
    auth.signOut()
    navigate('/')

  }
  return( 
    <div>
      <div className="flex justify-between">
        <>
           { user && user.displayName }
        </>

        <Button type="button" onClick={handleLogout}>
          Logout
        </Button>
        

      </div>
    </div>
    
    )

  
}
export default Profile