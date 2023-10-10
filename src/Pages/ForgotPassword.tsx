import { getAuth, sendPasswordResetEmail } from "firebase/auth"
import { useState, FormEvent } from "react"
import { TextInput } from "@mantine/core"


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
   <form onSubmit={handleSubmit}>
    <TextInput
    variant="unstyled"
    value={resetEmail}
    onChange={(e)=>setResetEmail(e.target.value)}
    className=" w-48 border border-white"
    />

    <button type="submit">
      press me
    </button>

   </form>
  )
}
export default ForgotPassword