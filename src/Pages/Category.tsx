import { useState, useEffect } from "react"
import { db } from "../firebaseConfig"
import { collection, getDocs, where, limit, query, startAfter, DocumentData } from "firebase/firestore"
import { useParams } from "react-router-dom"
import ListingItem from "../Components/ListingItem"

type ListingType = {
  id: string,
  data:DocumentData
}

const Category = () => {

  const [listing, setListings] = useState<ListingType[]>([])
  const [loading, setLoading] = useState(true)
  const params = useParams()

  useEffect(()=>{
    
    const fetchListings =async () => {

      try {

        //get a reference to the docs. so this gets the reference to the collection and not the doc like in signins and signups
        const listingRef = collection(db, 'listings')

        //create a query

        const q = query(listingRef, where('type', '==', params.categoryname),limit(10) )

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

  },[params.categoryname])
  return (
    <div>
      <h1>
        {params.categoryname === 'rent' ? 'places for rent' : 'places for sale'}
      </h1>

      <div>
        {loading ? <p>Loading...</p> : listing && listing.length > 0 ? <></>: <p>No listing for {params.categoryname}</p>}
      </div>

      <ul>
        {listing.map((list)=>(
          <ListingItem key={list.id} listing={list.data} id={list.id}/>
        ))}
      </ul>
    </div>
  )
}
export default Category