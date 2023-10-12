import { useState, FormEvent, ChangeEvent } from "react"
import { PasswordInput, TextInput, Divider} from "@mantine/core"
import { useNavigate } from "react-router-dom"
import { getAuth, createUserWithEmailAndPassword,updateProfile } from "firebase/auth"
import { setDoc, doc,} from "firebase/firestore"
import { db} from '../firebaseConfig'
import { Link } from "react-router-dom"
import { GoogleButton } from "../Components/GoogleButton"
import { GithuhButton } from "../Components/GithubButton"
import Button from "../Components/Button"
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

    <div className="flex justify-center" >

    <div className="flex flex-col space-y-5  mt-20 p-8 w-[30rem]">

         {/* first div with providers and text */}
      <div className="flex flex-col space-y-5">
        <p>Welcome to CasaTopia, register with</p>
        <div className="flex justify-between space-x-8">
          <GoogleButton>
          Google
        </GoogleButton>

        <GithuhButton>
          Github
        </GithuhButton>

        </div>
        

        <Divider label="Or continue with email" labelPosition="center" my="sm" />


      </div>
     <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <div>
      <label htmlFor="emailInput">Name</label>
      <TextInput      
      type="text"
      name="name"
      value={name}
      onChange={handleChange}
       
       />
      </div>


    <div>
      <label htmlFor="emailInput">Email</label>
      <TextInput      
      type="text"
      name="email"
      value={email}
      onChange={handleChange}
       
       />
      </div>
      
      <div>
      <label htmlFor="PasswordInput">Password</label>
       <PasswordInput       
       name="password"
       value={password}
       onChange={handleChange}       
               
       />

      </div>
       <div className="flex flex-row items-center justify-between">

        <Link to='/signin'>
        <p className="text-xs text-zinc-500 hover:underline">
         Already have an account? Login

        </p>
        </Link>
        

        <Button>
          Sign up

        </Button>

      </div>

     
    </form>    
    

      </div>

   
    </div>
     
  )
}
export default SignUp