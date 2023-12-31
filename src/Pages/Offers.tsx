import { useState, useEffect } from "react"
import { db } from "../firebaseConfig"
import { collection, getDocs, where, limit, query, DocumentData } from "firebase/firestore"
import { Loader } from "@mantine/core"

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
      <h1 className="font-bold text-xl">
        places on offer
      </h1>

      <div>
        {loading ? <Loader size={17}/> : listing && listing.length > 0 ? <></>: <p>No listing for offers</p>}
      </div>

      <div className="flex flex-col items-center mt-4 space-y-5  md:flex-row md:space-y-0 md:space-x-5 ">
        {listing.map((list)=>(
          <ListingItem key={list.id} listing={list.data} id={list.id}/>
        ))}
      </div>
    </div>
  )
}
export default Offers