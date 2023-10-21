import forSale from '../assets/forSell.jpg'
import forRent from '../assets/forRent.jpg'
import { Link } from 'react-router-dom'

const Explore = () => {
  return (
    <div className='flex flex-col space-y-5'>
      <h1>Category</h1>

      <div className="flex  space-x-10">
        <Link to='category/rent '>
          <img src={forRent} alt="" className='w-48 ' />
        </Link>

          <Link to='category/sale'>
            <img src={forSale} alt=""  className='w-48'/>
        </Link>

      </div>

    </div>
    
    
  )
}
export default Explore