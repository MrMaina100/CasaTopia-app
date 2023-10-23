import { PersonIcon } from "@radix-ui/react-icons"
import Button from "./Button"
import { Link } from "react-router-dom"

const Header = () => {
  return (
    <div className=" py-3 flex flex-row justify-between ">
      <h1 className="font-bold text-2xl md:underline md:decoration-wavy">
         CASATOPIA
      </h1>

      <div className="hidden md:flex flex-row space-x-4 items-center ">
        <Link to={'/offers'}>
         <p className="text-xl font-bold">Offers</p>

        </Link>
         <Button className="flex space-x-2 items-center bg-white text-black">
            <Link to={'/profile'} className="font-bold" >Profile</Link>
         <PersonIcon/>


         </Button>
      </div>

    </div>
  )
}
export default Header