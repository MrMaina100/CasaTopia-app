import { Navigate, Outlet } from "react-router-dom";
import useAuthStatus from "../hooks/useAuthStatus";

const PrivateRoute = () => {
 const {loading, loggedIn} = useAuthStatus()
 

 if(loading){
   <h3>loading...</h3>
 }

 return  loggedIn ? <Outlet/> : <Navigate to='/signin' />
  
 
}
export default PrivateRoute