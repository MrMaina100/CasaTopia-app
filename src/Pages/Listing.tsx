import { doc, getDoc, DocumentData } from "firebase/firestore"
import { db } from "../firebaseConfig"
import { getAuth } from "firebase/auth"
import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { Loader } from '@mantine/core';
import { Link } from "react-router-dom"
import Button from "../Components/Button"
import {MapContainer, Marker, TileLayer} from 'react-leaflet'
import { Carousel } from '@mantine/carousel';
import {BsHouseCheckFill} from 'react-icons/bs'
import{FaLocationDot,FaBed,FaBath,FaSquareCheck} from 'react-icons/fa6'


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
    <div className=" max-w-[1400px] mx-auto p-8">
      {/* slideshow yoooo */}

      {/* listng detail */}
      <div className="mb-10">
       {listing !==null && (

         
         <div className="flex flex-col space-y-2">
            <Carousel height={350} controlSize={37} withIndicators className="w-full">
               {listing.imageUrls.map((img:string)=>(
                  <Carousel.Slide key={img} >
                     <img src={img} alt="" className="h-full w-full object-cover " />
                  </Carousel.Slide>
               ))}
            </Carousel>

            <div className="flex flex-col space-y-2">
               <div className="flex space-x-2 items-center">
                  <BsHouseCheckFill/>
                  <h1 className="font-bold text-2xl">{listing.name}-${listing.offer ? listing.discountedPrice : listing.regularPrice}</h1>
               </div>
               <div className="flex space-x-2 items-center">
                  <FaLocationDot/>                  
                 < p>{listing.location}</p>

               </div>
               <p>for {listing.type === 'rent' ? "Rent" : "Sale"}</p>
               <div className="flex space-x-2 items-center">
                  <FaBed/>
                  <p>{listing.bedrooms > 1 ? `${listing.bedrooms}bedrooms`: '1 Bedroom'}</p>

               </div>
               <div className="flex space-x-2 items-center">
                  <FaBath/>
                <p>{listing.bathrooms > 1 ? `${listing.bathrooms}bathrooms`: '1 Bathroom'}</p>
               </div>               
                 {listing.parking ? (
                     <div className="flex space-x-2 items-center">
                          <FaSquareCheck/>
                          <p>{listing.parking && 'Furnished'}</p>


                     </div>

                  ):'' }             

                  {listing.furnished ? (
                     <div className="flex space-x-2 items-center">
                          <FaSquareCheck/>
                          <p>{listing.furnished && 'Furnished'}</p>


                     </div>

                  ): '' }
                
                
            </div>            
            
          {
            listing.offer && (
               <p>
                  ${listing.regularPrice-listing.discountedPrice} discount
               </p>
            )
          }       

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