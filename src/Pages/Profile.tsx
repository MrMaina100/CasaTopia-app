import { User, getAuth } from "firebase/auth"
import { useState, useEffect } from "react"
import Button from "../Components/Button"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { collection, getDocs, query, where, doc, deleteDoc, DocumentData  } from "firebase/firestore"
import { db } from "../firebaseConfig"
import ListingItem from "../Components/ListingItem"

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

  const onDelete = async (listingId:string)=>{
    if(window.confirm('are you sure')){
      await deleteDoc(doc(db, 'listings', listingId))

      const updatedListings = listings?.filter((list:DocumentData)=> list.id !==listingId)
      setListings(updatedListings)

      // a toast should go here 
    } 

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

      <Link to='/createlisting'>
        <p>sell or rent your home</p>
      </Link>

      {/* your homes */}

         

      {listings?.length > 0 &&(
        <div>

          <p>Your listings</p>
          {listings?.map((list:DocumentData)=>(
            <ListingItem onDelete={()=>onDelete(listings.id)} id={list.id} key={list.id} listing={list.data}/>


          ))}
        </div>
      )}



    </div>
    
    )

  
}
export default Profile