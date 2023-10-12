import { getAuth, sendPasswordResetEmail } from "firebase/auth"
import { useState, FormEvent } from "react"
import { TextInput } from "@mantine/core"
import { Link } from "react-router-dom"
import {ArrowLeftIcon} from '@radix-ui/react-icons'



const ForgotPassword = () => {

  const [resetEmail, setResetEmail] = useState('')
  const handleSubmit = async (e:FormEvent<HTMLFormElement>)=>{
    e.preventDefault()

    try {

      const auth  = getAuth()
      await sendPasswordResetEmail(auth, resetEmail)
      console.log('success');
      setResetEmail('')
      
      
    } catch (error) {
      console.log(error);
      
      
    }



  }


  return (
    <div className="flex justify-center">

    <div className="flex flex-col space-y-5  mt-20 p-8 w-[30rem] shadow-xl">

      {/* detailed text */}
      <div className="flex flex-col space-y-2  ">
        <h1>Forgot your Password?</h1>
        <p className="graylightText">Enter your email to get a reset Link</p>

      </div>

    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">

    <div>
    <label htmlFor="resetEmail">Your email</label>
    <TextInput    
    value={resetEmail}
    onChange={(e)=>setResetEmail(e.target.value)}
    
    
    />
    </div>
   

   <div className="flex flex-row items-center justify-between">

    <Link to='/signin' className="flex space-x-2 items-center">
    <ArrowLeftIcon/>
    <p className="graylightText">Back to the login page</p>

    </Link>


    <button type="submit">
      Reset Password
    </button>
   </div>

    </form>
    </div>
    </div>
 
  )
}
export default ForgotPassword