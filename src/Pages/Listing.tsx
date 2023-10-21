import { doc, getDoc, DocumentData } from "firebase/firestore"
import { db } from "../firebaseConfig"
import { getAuth } from "firebase/auth"
import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { Loader } from '@mantine/core';
import { Link } from "react-router-dom"
import Button from "../Components/Button"
import {MapContainer, Marker, Popup, TileLayer} from 'react-leaflet'

const Listing = () => {
   const [listing, setListing] = useState<DocumentData| null>(null)
   const [loading, setLoading] = useState(true)

  
   const params = useParams()
   const auth = getAuth()
   const navigate = useNavigate()

   useEffect(()=>{

      const fetchListing = async()=>{

         //get a document refernce 

         const docRef = doc(db, `listings/${params.listingId}`)
         const docSnap = await getDoc(docRef)

         if(docSnap.exists()){
            console.log(docSnap.data());
            
            setListing(docSnap.data())
            setLoading(false)
         }
      }

      fetchListing() 

   },[navigate, params.listingId])

   // loading state / spinner to go here 
   if(loading){
      return <Loader color="blue" size={17}/>
   }

   
  return (
    <div>
      {/* slideshow yoooo */}

      {/* listng detail */}
      <div>
       {listing !==null && (
         <div>
            <p>{listing.name}-${listing.offer ? listing.discountedPrice : listing.regularPrice}</p>
            <p>{listing.location}</p>
            <p>for {listing.type === 'rent' ? "Rent" : "Sale"}</p>
          {
            listing.offer && (
               <p>
                  ${listing.regularPrice-listing.discountedPrice} discount
               </p>
            )
          }

          {/* listing details */}

          <div>
            <p>{listing.bedrooms > 1 ? `${listing.bedrooms}bedrooms`: '1 Bedroom'}</p>
            <p>{listing.bathrooms > 1 ? `${listing.bathrooms}bathrooms`: '1 Bathroom'}</p>
            <p>{listing.parking && 'Parking spot'}</p>
            <p>{listing.furnished && 'Furnished'}</p>

          </div>

          {/* map location */}
          <div className="w-full h-48">
            <MapContainer center={[listing.geolocation.lat, listing.geolocation.lng]} zoom={13} scrollWheelZoom={false} style={{height:'100%', width:'100%'}} >

               <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                <Marker position={[listing.geolocation.lat, listing.geolocation.lng]}>

                </Marker>

            </MapContainer>
          </div>


          {auth.currentUser?.uid !== listing.userRef &&(

            <Link to={`/contact/${listing.userRef}?listingName=${listing.name}`}>
               <Button>Contact landlord</Button>
            </Link>

          )}

         </div>
       )}
      </div>


    </div>
  )
}
export default Listing