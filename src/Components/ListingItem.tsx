import { Link } from "react-router-dom"
import { Card, Group, Badge, CardSection } from "@mantine/core"
const ListingItem = ({listing, id}) => {
  return (
    <div className="flex flex-col space-y-5 md:flex-row md:space-y-0 md:space-x-5">
    
      <Link to={`/category/${listing.type}/${id}`}>
         <Card withBorder radius={"md"} className="w-72">
            <Card.Section className=" h-40">
               <img src={listing.imageUrls[0]} alt="" />
            </Card.Section>

            <Card.Section className="mt-10">
               <p className="graylightText">
                  {listing.location}
               </p>
               <h1>{listing.name}</h1>
            </Card.Section>
            <CardSection>
               <p>{listing.regularPrice}</p>

            </CardSection>

           

         </Card>

      </Link>
     
    </div>
  )
}
export default ListingItem