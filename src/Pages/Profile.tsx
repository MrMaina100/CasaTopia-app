import { User, getAuth } from "firebase/auth"
import { useState, useEffect } from "react"
import Button from "../Components/Button"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { collection, getDocs, query, where, doc, deleteDoc, DocumentData  } from "firebase/firestore"
import { db } from "../firebaseConfig"
import ListingItem from "../Components/ListingItem"
import { Card } from "@mantine/core"

type ListingType = {
  id: string,
  data:DocumentData
}


const Profile = () => { 

  const [user, setUser] = useState< User | null>(null)
  const [listings, setListings] = useState<DocumentData|null>(null)
  const navigate = useNavigate()
  

  const auth = getAuth()
  useEffect(()=>{

    const fetchUserListings = async()=>{

      const listingsRef = collection(db, 'listings')

      const q = query(listingsRef, where('userRef', '==', auth.currentUser?.uid))

      // snapshot

      const querySnap = await getDocs(q)

      let listings:ListingType[] = []

      querySnap.forEach((doc)=>(
        listings.push({
          id: doc.id,
          data:doc.data()

        })
      ))

      setListings(listings)
      
    }

    fetchUserListings()
        
    setUser(auth.currentUser)
  },[auth.currentUser?.uid])

  const handleLogout = ()=>{
    auth.signOut()
    navigate('/')

  }

  // const onDelete = async (listingId:string)=>{
  //   if(window.confirm('are you sure')){
  //     await deleteDoc(doc(db, 'listings', listingId))

  //     const updatedListings = listings?.filter((list:DocumentData)=> list.id !==listingId)
  //     setListings(updatedListings)

  //     // a toast should go here 
  //   } 

  // }
  return( 
    <div className="px-4 pb-24">
      <div className="flex justify-between items-center mt-2 mb-5">
        <div className=" flex space-x-2 font-bold text-semibold">
          <p>Welcome</p>          
           <p>
            { user && user.displayName }
          </p>       
          
        </div>

        <Button type="button" onClick={handleLogout}>
          Logout
        </Button>
        

      </div>

      <Link to='/createlisting'>
        <Card className="w-56 rounded-xl">sell or rent your home</Card>
      </Link>

      {/* your homes */}

         
      <p className="font-bold  mt-8">Your listings</p>
      {listings?.length > 0 &&(
        <div className="flex flex-col items-center space-y-4 md:flex-row md:space-x-5 ">
          <p></p>        
          {listings?.map((list:DocumentData)=>(
            <ListingItem  id={list.id} key={list.id} listing={list.data}/>


          ))}
        </div>
      )}



    </div>
    
    )

  
}
export default Profile