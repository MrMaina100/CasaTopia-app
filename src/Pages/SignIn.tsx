import { useState, FormEvent, ChangeEvent } from "react"
import { PasswordInput, TextInput, Divider } from "@mantine/core"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import { useNavigate, Link } from "react-router-dom"
import { GoogleButton } from "../Components/GoogleButton"
import { GithuhButton } from "../Components/GithubButton"
import Button from "../Components/Button"



const SignIn = () => {
  

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email:'',
    password:''
  })

  const {email, password} = formData

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
      const userCredentials = await signInWithEmailAndPassword(auth, email, password)

      if(userCredentials.user){
        navigate('/profile')
        
      }
      
    } catch (error) {
      console.log(error);
      
      
    }

  }

  return (

    <div className="flex justify-center">

      <div className="flex flex-col space-y-5  mt-20 p-8 w-[30rem]">
      
      {/* first div with providers and text */}
      <div className="flex flex-col space-y-5">
        <p>Welcome back, login with</p>
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

      <div className="flex flex-row items-center justify-between mt-2">

        <Link to='/signup'>
        <p className="text-xs text-zinc-500 hover:underline">
          Don't have an account? Sign up

        </p>
        </Link>
        

        <Button>Sign in</Button>

      </div>


      
    </form>

      </div>
    

    </div>
  
  )
}
export default SignIn