import { Overlay } from "@mantine/core"
import Header from "../Components/Header"
import {BsHouses, BsHouseLock} from 'react-icons/bs'
import { SlidingTabBar } from "../Components/Footer"
import { Link } from "react-router-dom"

const Explore = () => {
  return (
    <div>
      {/* div with the bg image */}
      <div className="relative h-screen bg-hero bg-no-repeat bg-cover bg-center ">
        <Overlay
          gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 700) 60%)"
        opacity={0.5}
        zIndex={0}
        />

        {/* the container div */}
        <div className="relative px-7">
        <Header/>

        {/* div with all the content */}
        <div className="flex flex-col space-y-2 max-w-3xl mt-28 md:mt-48 ">
          <h1 className="text-4xl font-bold leading-none md:text-[88px] pb-2 ">Elavate your living Experience</h1>
          <p className="font-bold text-lg">Explore a wide range of properties or sell yours</p>

          {/* boxes to choose from category */}
          <div  className="flex flex-row space-x-5">

            <Link to={'/category/rent'} className="h-28 w-30 p-4 rounded-2xl bg-blue-200 flex flex-col items-start text-black">
              <BsHouses/>
              <h1>For Rent</h1>
              <p className="text-sm font-semibold ">Find your perfect spot</p>

            </Link>

            <Link to={'/category/sale'} className="h-28 w-30 p-4 rounded-2xl bg-white flex flex-col items-start text-black">
              <BsHouseLock/>
              <h1>For Sale</h1>
              <p className="text-sm font-semibold">Find your dream house</p>

            </Link>
          </div>


        </div>
        </div>   
       
      </div>

      
    </div>
  )
}
export default Explore
