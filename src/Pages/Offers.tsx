import { useState, useEffect } from "react"
import { db } from "../firebaseConfig"
import { collection, getDocs, where, limit, query, startAfter, DocumentData } from "firebase/firestore"

import ListingItem from "../Components/ListingItem"

type ListingType = {
  id: string,
  data:DocumentData
}

const Offers = () => {

  const [listing, setListings] = useState<ListingType[]>([])
  const [loading, setLoading] = useState(true)
  

  useEffect(()=>{
    
    const fetchListings =async () => {

      try {

        //get a reference to the docs. so this gets the reference to the collection and not the doc like in signins and signups
        const listingRef = collection(db, 'listings')

        //create a query

        const q = query(listingRef, where('offer', '==', true ),limit(10) )

        //execute a query and get a snapshot 
        const querySnap = await getDocs(q)

        const listings:ListingType[] = []
        querySnap.forEach((doc)=>{
          return listings.push({
            id: doc.id,
            data:doc.data()
          })
        })

        setListings(listings)
        setLoading(false)

        
      } catch (error) {

        console.log(error);
        
        
      }
      
    }

    fetchListings()

  },[])
  return (
    <div>
      <h1>
        places on offer
      </h1>

      <div>
        {loading ? <p>Loading...</p> : listing && listing.length > 0 ? <></>: <p>No listing for offers</p>}
      </div>

      <ul>
        {listing.map((list)=>(
          <ListingItem key={list.id} listing={list.data} id={list.id}/>
        ))}
      </ul>
    </div>
  )
}
export default Offers