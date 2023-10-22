import { useState, useEffect, useRef, FormEvent} from "react"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { useNavigate } from "react-router-dom"
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { v4 as uuidv4 } from 'uuid'
import { TextInput, Textarea,} from "@mantine/core"
import Button from "../Components/Button"
import { formData } from "../types";
import { Loader,Paper } from "@mantine/core";

type geoLocationType = {
   lat:number
   lng:number
}



const CreateListing = () => {
   const [geolocationEnabled, setGeoLocationEnabled] = useState(true)
   const [loading, setLoading] = useState(true)
   const [formData, setFormData]= useState<formData>({
      type:'rent',
      name:'',
      bedrooms:1,
      bathrooms:1,
      parking:'false',
      furnished:'false',
      address:'',
      offer:'false',
      regularPrice:0,
      discountedPrice:0,
      images:[],
      latitude:0,
      longitude:0,
      userRef:''
   })

   const {type, name, bathrooms, bedrooms, parking, furnished,address, offer, regularPrice, discountedPrice,images, latitude, longitude} = formData

   const auth = getAuth()
   const navigate = useNavigate()
   const isMounted = useRef(true)

   useEffect(()=>{
      if(isMounted){
         onAuthStateChanged(auth, (user)=>{
            if(user){
               setFormData({...formData, userRef: user.uid})
               
            }else{
               navigate('/signin')
            }

         })

      }
      setLoading(false)

      return ()=>{
         isMounted.current = false
      }
   },[isMounted])

   const handleSubmt = async(e:FormEvent<HTMLFormElement>)=>{
      e.preventDefault()
      console.log(formData);

      setLoading(true)

    if(discountedPrice!>= regularPrice){
      setLoading(false)
      console.log('something about prices');
      

    }

    //this is the variable that store the latitude and longitude that later on gets submmited to firebase.


    let geolocation:geoLocationType = {
      lat:0,
      lng:0
    }

    let location; 

    if(geolocationEnabled){

      //if our geolocation is enabled we want to make our request to google 
      const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${import.meta.env.VITE_GEOCODE_API_KEY}`)

      const data = await res.json()
      console.log(data);

      geolocation.lat =data.results[0]?.geometry.location.lat ?? 0,
      geolocation.lng = data.results[0]?.geometry.location.lng ?? 0
      location = data.status === 'ZERO_RESULTS' ? undefined : data.results[0]?.formatted_address

      if(location === undefined || location.includes('undefined') ){
         setLoading(false)
         console.log('please enter a correct addresss');
         
      }
      

      

    }else{
      geolocation.lat = latitude
      geolocation.lng = longitude
      location = address
    }

    //store images in firebase 
    const storeImages = async(image:any)=>{
      return new Promise((resolve, reject)=>{
         const storage = getStorage()
         const filename = `${auth.currentUser?.uid}-${image.name}-${uuidv4()}`

         //storage reference 
         const storageRef = ref(storage, 'images/' + filename)

         //upload task 

         const uploadTask = uploadBytesResumable(storageRef, image)
         uploadTask.on('state_changed', 
        (snapshot) => {
       // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
         console.log('Upload is ' + progress + '% done');
         switch (snapshot.state) {
         case 'paused':
         console.log('Upload is paused');
         break;
        case 'running':
        console.log('Upload is running');
        break;
       }
     }, 
     (error) => {
     // Handle unsuccessful uploads
     reject(error)
      }, 
      () => {
      // Handle successful uploads on complete
      // For instance, get the download URL: https://firebasestorage.   googleapis.com/...
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      resolve(downloadURL);
      });
    }
  );           

      })
    }

    const imageUrls = await Promise.all(
      [...images!].map((image)=> storeImages(image))
    ).catch(()=>{
      setLoading(false)
      console.log('images not uploaded');
      
    })

    const formDataCopy = {
      ...formData,
      imageUrls,
      geolocation,
      location
    }
   
    
    formDataCopy.location = address
    delete formDataCopy.address
    delete formDataCopy.images
   //  location && (formDataCopy.geolocation = location)
    !formDataCopy.offer && delete formDataCopy.discountedPrice

    const docRef = await addDoc(collection(db, 'listings'), formDataCopy)

    setLoading(false)
    
    console.log("success:listing saved");
    navigate(`/category/${formDataCopy.type}/${docRef.id}`)
    

   
      


   }
   
   

   const mutate = (e:any)=>{

      let boolean:boolean | null = null

      if(e.target.value === 'true'){
         boolean = true
      }
       if(e.target.value === 'false'){
         boolean = false
      }

      //files
      if(e.target.files){
         setFormData((prevState)=>({
            ...prevState,
            images: e.target.files
         }))
      }

      // something happens for text or booleans or numbers
      
      if(!e.target.files){
         setFormData((prevState)=>({
            ...prevState,
            [e.target.id] : boolean ?? e.target.value
         }))
      }

   }

   if(loading) {
      return <Loader size={15}/>
   }

  return (
    <div className="flex flex-col space-y-5 justify-center items-center">
      <div>
         <h1 className="text-2xl font-bold ">Create a Listing</h1>
      </div>

      <div className="mb-10 shadow-2xl md:px-20 pb-5">
         <form onSubmit={handleSubmt}>
            <label htmlFor="type" >Sell/rent</label>
           <div className="flex flex-row space-x-1">
          <button type="button" className={type === 'sale'? 'ButtonActive' : 'FormButton'} id="type" value='sale' onClick={mutate}>
               sell</button>
               <button type="button" className={type === 'rent'? 'ButtonActive' : 'FormButton'} id="type" value='rent' onClick={mutate}>
               rent</button>
           </div>

           {/* name of the listing */}
           <label htmlFor="name">Name</label>
           <TextInput
           type="text"
           id="name"
           value={name}
           onChange={mutate}
         
           
           />
           {/* bedrooms */}
           <div className="flex space-x-1">
            <div >
               <label htmlFor="bedrooms" >Bedrooms</label>
               <TextInput
               type="number"
                id="bedrooms"
                value={bedrooms}
                onChange={mutate}                          
               
               />
            </div>
            <div>
               <label htmlFor="bathrooms">Bathrooms</label>
               <TextInput
               type="number"
                id="bathrooms"
                value={bathrooms}
                onChange={mutate}                           
               
               />
            </div>
           </div>

           {/* the parking  */}
           <label htmlFor="parking">Parking spot</label>
           <div className="flex flex-row space-x-1">
          <button type="button" className={parking ? 'ButtonActive' : 'FormButton'} id="parking" value={'true'} onClick={mutate}>
               Yes</button>


               <button type="button" className={!parking && parking !== null ? 'ButtonActive' : 'FormButton'} id="parking" value={'false'} onClick={mutate}>
               No</button>
           </div>


           {/* the furnishing */}


            <label htmlFor="furnished">Furnished</label>
           <div className="flex flex-row space-x-1">
          <button type="button" className={furnished ? 'ButtonActive' : 'FormButton'} id="furnished" value={'true'} onClick={mutate}>
               yes</button>
               <button type="button" className={!furnished && furnished !== null ? 'ButtonActive' : 'FormButton'} id="furnished" value={'false'} onClick={mutate}>
               No</button>
           </div>

           <label htmlFor="address" >Address</label>
           <Textarea
           id="address"          
           value={address}
           onChange={mutate}           
           />
           {/* manual input of latitude and long */}
           {!geolocationEnabled && (
             <div className="flex space-x-5">
               <div>
                  <label htmlFor="latitude" >Latitude</label>
                  <TextInput
                  type="number"
                  id="latitude"
                  value={latitude}
                  onChange={mutate}
                  
                  />
               </div>

               {/* div 2 */}
               <div>
                  <label htmlFor="longitude">Longitude</label>
                  <TextInput
                  type="number"
                  id="longitude"
                  value={longitude}
                  onChange={mutate}
                  
                  />

               </div>


             </div>
           )}

           {/* offers */}

            <label htmlFor="offer">Offer</label>
           <div className="flex flex-row space-x-1">
             <button type="button" className={offer ? 'ButtonActive' : 'FormButton'} id="offer" value={'true'} onClick={mutate}>
               Yes</button>
               <button type="button" className={!offer && offer !== null ? 'ButtonActive' : 'FormButton'} id="offer" value={'false'} onClick={mutate}>
               No</button>
           </div>

           {/* regular price */}
           <label htmlFor="regularPrice" >regularPrice</label>
           <div className="flex items-center">
            <TextInput
            type="number"
            id="regularPrice"
            value={regularPrice}
            onChange={mutate}

            
            />
            {type === 'rent' && (
               <p>$/month</p>
            )}
           </div>


           {/* showing discounted price */}
           {offer && (
            <>
            <label htmlFor="discountedPrice">Discounted Price</label>
            <TextInput
            type="number"
            id="discountedPrice"
            value={discountedPrice}
            onChange={mutate}
            className="w-1/2"

            
            />
            
            </>
           )}

           {/* image upload */}

           <label htmlFor="images">Images</label> <br />
           
           <input
           type="file"
           id="images"                         
           onChange={mutate}
           accept=".jpg,.png,.jpeg"
           multiple
           required
           
           
           /> <br />

           <Button type="submit" className="mt-5">
            Create Listing
           </Button>

         </form>
         
      </div>

    </div>
  )
}

export default CreateListing