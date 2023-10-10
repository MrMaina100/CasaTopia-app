import { useState, FormEvent, ChangeEvent } from "react"
import { PasswordInput, TextInput} from "@mantine/core"
import { useNavigate } from "react-router-dom"
import { getAuth, createUserWithEmailAndPassword,updateProfile } from "firebase/auth"
import { setDoc, doc,} from "firebase/firestore"
import { db} from '../firebaseConfig'
import GoogleAuth from "../Components/GoogleAuth"
type form = {
  name: string,
  email: string,
  password: string 

}

const SignUp = () => {

  const navigate = useNavigate()

  const [formData, setFormData] = useState<form>({
    name:'',
    email:'',
    password:''
  })

  const {name,email, password} = formData

  const handleChange = (e:ChangeEvent<HTMLInputElement>)=>{
    setFormData((prevState)=>({
      ...prevState,
      [e.target.name]:e.target.value

    }))

  }

  const handleSubmit = async (e:FormEvent<HTMLFormElement>)=>{
    e.preventDefault()

    try {

      const auth = getAuth()

      
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password)

       const user =  userCredentials.user


       updateProfile(user, {
        displayName: name
       })

       const formDataCopy = {name, email}
      
        // formDataCopy.timestamp = serverTimestamp()

       await setDoc(doc(db, 'users', user.uid), formDataCopy) 



      
  
      navigate('/');
    
    } catch (error) {
      console.log(error);
      
      
    }

    console.log(db.type);  
    
    
  }
  return (

    <>

    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Name</label>
      <TextInput
      variant="unstyled"
      name="name"
      value={name}
      onChange={handleChange}
      className=" w-48 border border-white"
      
      />
      <label htmlFor="email"> email </label>
      <TextInput 
      variant="unstyled"
      name="email"
      value={email}
      onChange={handleChange}
       className="w-48 border border-white"
       />
      
      <label htmlFor="passwod">Password</label>

       <PasswordInput
       variant="unstyled"
       name="password"
       value={password}
       onChange={handleChange}
       className="w-48 border border-white"
       
       />
      
      <button type="submit">press me</button>

      <GoogleAuth/>

     
    </form>    
    
    </>
     
  )
}
export default SignUp