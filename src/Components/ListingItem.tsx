import { Link } from "react-router-dom"
import {TrashIcon} from '@radix-ui/react-icons'
import { Card,  } from "@mantine/core"
import { DocumentData } from "firebase/firestore"
import {SlLocationPin} from 'react-icons/sl'

type propsTypes = {
   listing:DocumentData,
   id:string,
   onDelete?:()=>void
}
const ListingItem = ({listing, id, onDelete}:propsTypes) => {
  return (
    <div>
    
      <Link to={`/category/${listing.type}/${id}`}>
         <Card className="flex flex-col space-y-4 w-72  ">
            <Card.Section className=" h-48">
               <img src={listing.imageUrls[0]} alt="" className="w-full h-full"/>
            </Card.Section>

            <div className="flex flex-col">
             
               <p className="graylightText flex items-center">
                  <SlLocationPin/>
                  {listing.location}
               </p>
               <h1>{listing.name}</h1>
             
               
             <div>
               <p>{listing.regularPrice}{listing.type === 'rent'? '/per Month' : ''}
               </p>

             </div>

            </div>  

           

         </Card>

      </Link>

      {
         onDelete&&(
            <TrashIcon onClick={()=>onDelete()}/>

         )
      }
     
    </div>
  )
}
export default ListingItem
