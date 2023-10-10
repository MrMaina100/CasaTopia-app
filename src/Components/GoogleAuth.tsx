import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { db } from "../firebaseConfig"
import { useNavigate } from "react-router-dom"

const GoogleAuth = () => {

   const navigate = useNavigate()

   const handleClick = async () => {

      try {

         //this just authenticates
         const auth = getAuth()
         const provider = new GoogleAuthProvider()
         const result = await signInWithPopup(auth,provider)
         const user = result.user

         //okay so now we want to do is check to see if the user already exists in the firestore and if the the user doesn't exist we should add it.

         //get a reference to the document

         const docRef = doc(db, 'users', user.uid)
         const docSnapshot = await getDoc(docRef)
         
         if(!docSnapshot.exists()){
            await setDoc(doc(db, 'users', user.uid),{
               name:user.displayName,
               email:user.email

            })
         }

         navigate('/')
         
      } catch (error) {
         console.log(error);
         
         
      }
      
   }

   

  return (
    <div>
      <button onClick={handleClick}>
         Sign in with google</button>
    </div>
  )
}
export default GoogleAuth