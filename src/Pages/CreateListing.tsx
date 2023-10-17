import { useState, useEffect, useRef, FormEvent} from "react"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { useNavigate } from "react-router-dom"
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db } from "../firebaseConfig";
import { v4 as uuidv4 } from 'uuid'
import { TextInput, Textarea,} from "@mantine/core"
import Button from "../Components/Button"

type geoLocationType = {
   lat:number
   lng:number
}



const CreateListing = () => {
   const [geolocationEnabled, setGeoLocationEnabled] = useState(true)
   const [loading, setLoading] = useState(true)
   const [formData, setFormData]= useState({
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

    if(discountedPrice>= regularPrice){
      setLoading(false)
      console.log('something about prices');
      

    }

    //this is the variable that store the latitude and longitude that later on gets submmited to firebase.


    let geoLocation:geoLocationType = {
      lat:0,
      lng:0
    }

    let location; 

    if(geolocationEnabled){

      //if our geolocation is enabled we want to make our request to google 
      const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${import.meta.env.VITE_GEOCODE_API_KEY}`)

      const data = await res.json()
      console.log(data);

      geoLocation.lat =data.results[0]?.geometry.location.lat ?? 0,
      geoLocation.lng = data.results[0]?.geometry.location.lng ?? 0
      location = data.status === 'ZERO_RESULTS' ? undefined : data.results[0]?.formatted_address

      if(location === undefined || location.includes('undefined') ){
         setLoading(false)
         console.log('please enter a correct addresss');
         
      }
      

      

    }else{
      geoLocation.lng = latitude
      geoLocation.lng = longitude
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
      [...images].map((image)=> storeImages(image))
    ).catch(()=>{
      setLoading(false)
      console.log('images not uploaded');
      
    })

    setLoading(false)

   
      


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
      return <p>loading...</p>
   }

  return (
    <div>
      <div>
         <h1>Create a Listing</h1>
      </div>

      <div>
         <form onSubmit={handleSubmt}>
            <label >Sell/rent</label>
           <div className="flex flex-row space-x-5">
          <button type="button" className={type === 'sale'? 'ButtonActive' : 'FormButton'} id="type" value='sale' onClick={mutate}>
               sell</button>
               <button type="button" className={type === 'rent'? 'ButtonActive' : 'FormButton'} id="type" value='rent' onClick={mutate}>
               rent</button>
           </div>

           {/* name of the listing */}
           <TextInput
           type="text"
           id="name"
           value={name}
           onChange={mutate}
           label='name'
           
           />
           {/* bedrooms */}
           <div className="flex">
            <div>
               <label >Bedrooms</label>
               <TextInput
               type="number"
                id="bedrooms"
                value={bedrooms}
                onChange={mutate}                          
               
               />
            </div>
            <div>
               <label >Bathrooms</label>
               <TextInput
               type="number"
                id="bathrooms"
                value={bathrooms}
                onChange={mutate}                           
               
               />
            </div>
           </div>

           {/* the parking  */}
           <label >Parking spot</label>
           <div className="flex flex-row space-x-5">
          <button type="button" className={parking ? 'ButtonActive' : 'FormButton'} id="parking" value={'true'} onClick={mutate}>
               Yes</button>


               <button type="button" className={!parking && parking !== null ? 'ButtonActive' : 'FormButton'} id="parking" value={'false'} onClick={mutate}>
               No</button>
           </div>


           {/* the furnishing */}


            <label >Furnished</label>
           <div className="flex flex-row space-x-5">
          <button type="button" className={furnished ? 'ButtonActive' : 'FormButton'} id="furnished" value={'true'} onClick={mutate}>
               yes</button>
               <button type="button" className={!furnished && furnished !== null ? 'ButtonActive' : 'FormButton'} id="furnished" value={'false'} onClick={mutate}>
               No</button>
           </div>

           <label >Address</label>
           <Textarea
           id="address"          
           value={address}
           onChange={mutate}           
           />
           {/* manual input of latitude and long */}
           {!geolocationEnabled && (
             <div className="flex space-x-5">
               <div>
                  <label >Latitude</label>
                  <TextInput
                  type="number"
                  id="latitude"
                  value={latitude}
                  onChange={mutate}
                  
                  />
               </div>

               {/* div 2 */}
               <div>
                  <label>Longitude</label>
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

            <label >Offer</label>
           <div className="flex flex-row space-x-5">
             <button type="button" className={offer ? 'ButtonActive' : 'FormButton'} id="offer" value={'true'} onClick={mutate}>
               Yes</button>
               <button type="button" className={!offer && offer !== null ? 'ButtonActive' : 'FormButton'} id="offer" value={'false'} onClick={mutate}>
               No</button>
           </div>

           {/* regular price */}
           <label >regularPrice</label>
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
            <label>Discounted Price</label>
            <TextInput
            type="number"
            id="discountedPrice"
            value={discountedPrice}
            onChange={mutate}

            
            />
            
            </>
           )}

           {/* image upload */}

           <label>Images</label>
           <p>The first images uploaded will be the cover max is 6</p>
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