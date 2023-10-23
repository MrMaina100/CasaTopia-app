import { useState, useEffect, ChangeEvent} from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { db } from "../firebaseConfig"
import { doc,getDoc, DocumentData} from "firebase/firestore"
import Button from "../Components/Button"
import { Textarea } from "@mantine/core"

const Contact = () => {
   const [message, setMessage] = useState('')
   const [landLord, setLandLord] = useState<DocumentData|null>(null)
   const [searchParams, setSearchParams] = useSearchParams()
   //this will allow us to get the listingName that we passing in as a query string

   const params = useParams()
   useEffect(()=>{

      const getLandLord = async () => {
         const docRef = doc(db, `users/${params.landLordId}`)
         const docSnap = await  getDoc(docRef)

         if(docSnap.exists()){
            console.log(docSnap.data());
            
            setLandLord(docSnap.data())
         }else{
            console.log('landlord does not exists');
            
         }
         
      }

      getLandLord()


   },[params.landLordId])


   const handleChange = (e:ChangeEvent<HTMLTextAreaElement>)=> setMessage(e.target.value)

  return (
    <div className="p-2 ">
      <p>Contact landlord</p>

      {landLord !== null&&(
         <div >
            <h1 className="font-bold text-lg">{landLord.name}</h1>
            <form className="flex flex-col space-y-4" >
               <label htmlFor="message">Message</label>
               <Textarea name="message" id="message" value={message} onChange={handleChange} className="md:max-w-[50%]">

               </Textarea>

               <a href={`mailto:${landLord.email}?subject=${searchParams.get('listingName')}&body=${message}`}>
                  <Button type="button">
                     Send Message
                  </Button>

               </a>
            </form>

         </div>
      )}
    </div>
  )
}
export default Contact