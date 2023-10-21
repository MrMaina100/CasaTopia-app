import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import SignUp from './Pages/SignUp';
import ForgotPassword from './Pages/ForgotPassword';
import Explore from './Pages/Explore';
import Profile from './Pages/Profile';
import SignIn from './Pages/SignIn';
import Offers from './Pages/Offers';
import PrivateRoute from './Components/PrivateRoute';
import Category from './Pages/Category';
import CreateListing from './Pages/CreateListing';
import Listing from './Pages/Listing';
import Contact from './Pages/Contact';
import {Toaster} from 'sonner'


const App = () => {
  return (
    <MantineProvider defaultColorScheme='auto'>
      <Toaster/>   
   
      <Router>
        <Routes>
          <Route path='/' element={<Explore/>}/>
          <Route path='/offers' element={<Offers/>}/>
          <Route path='/category/:categoryname' element={<Category/>}/>
          <Route path='/profile' element={<PrivateRoute />} >
             <Route path='/profile' element={<Profile/>} />
          </Route>
          <Route path='/signin' element={<SignIn/>}/>
          <Route path='/signup' element={<SignUp/>}/>
          <Route path='/forgotpassword' element={<ForgotPassword/>} />
          <Route path='createlisting' element={<CreateListing/>}/>
          <Route path='/category/:categoryName/:listingId' element={<Listing/>}/>
          <Route path='/contact/:landLordId' element={<Contact/>}/>
        </Routes>
      </Router>

      
    </MantineProvider>
  )
}
export default App 