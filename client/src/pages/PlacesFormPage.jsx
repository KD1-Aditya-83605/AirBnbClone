import { Navigate, useParams } from "react-router-dom";
import AccountNav from "../AccountNav";
import PERKS from "../PERKS";
import { useEffect, useState } from "react";
import axios from "axios";


export default function PlacesFormPage(){

    const {id}  = useParams();
    console.log(id);

    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [addedPhotos, setAddedPhotos] = useState([]);
    const [photoLink, setPhotoLink] = useState('');
    const [description, setDescription] = useState('');
    const [perks, setPerks] = useState('');
    const [extraInfo, setExtraInfo] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [maxGuests, setMaxGuests] = useState(1);
    const [price,setPrice] = useState(100);
    
    const [redirect,setRedirect] = useState(false);


    useEffect(()=>{
        if(!id){
            return;
        }
        axios.get('/places/'+id).then(responce=>{
            const {data} = responce;
            setTitle(data.title);
            setAddress(data.address);
            setAddedPhotos(data.photos);
            setDescription(data.description);
            setPerks(data.perks);
            setExtraInfo(data.extraInfo);
            setCheckIn(data.checkIn);
            setCheckOut(data.checkOut);
            setMaxGuests(data.maxGuests);
            setPrice(data.price);
        })

    },[id]);
    


    async function savePlace(ev){
        ev.preventDefault();

        if(id){

            const placeData = {title,address,addedPhotos,description,perks,extraInfo,checkIn,checkOut,maxGuests,price}

            await axios.put('/places',{

               id, ... placeData
            });
 
             setRedirect(true);
            
        }
        else{
            //new place

            const placeData = {title,address,addedPhotos,description,perks,extraInfo,checkIn,checkOut,maxGuests}

            await axios.post('/places',placeData);
 
             setRedirect(true);
        }

       
         

            
 

    }

    if(redirect){ 
        return <Navigate to={'/account/places'} />
    }


    function inputDescription(text) {
        return (
            <p className="text-gray-500 text-sm">{text}</p>
        );
    }

    function preInput(header, description) {
        return (
            <>
                {inputHeader(header)}
                {inputDescription(description)}
            </>
        );
    }


    function inputHeader(text) {
        return (
            <h2 className="text-2xl mt-4">{text}</h2>
        );
    }

    async function addPhotoByLink(ev){
        ev.preventDefault();
             const{data:filename} =  await axios.post('/upload-by-link',{link: photoLink})
    
             console.log("before update",addedPhotos);
             console.log(filename);
             setAddedPhotos(prev=>{
                return ([...prev,filename]);
             });
             console.log("after update",addedPhotos);
    
             setPhotoLink('');
        }

        

        
    


  


    return(
        <div>
            <AccountNav/> 
                    <form onSubmit={savePlace}>
                        {preInput('Title', 'Title for your place, should be short and impressive')}
                        <input type="text" value={title } onChange={ev=> setTitle(ev.target.value)} placeholder="title, for example: My House" />

                        {preInput('Address', 'Address to your place')}
                        <input type="text" value={address}
                        onChange={ev=> setAddress(ev.target.value)}placeholder="address" />

                        {preInput('Photos', 'Add photos')}
                        <div className="flex gap-2">
                            <input type="text" value={photoLink} onChange={ev=> setPhotoLink(ev.target.value)} placeholder="Add using a link" />
                            <button onClick={addPhotoByLink} className="bg-gray-200 px-4 rounded-2xl">Add&nbsp; a photo</button>
                        </div>
                       
                        <div className="mt-2 grid gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                            {addedPhotos.length>0 && addedPhotos.map(link=>(
                                <div key={link}>
                                    <img className="rounded-2xl" src={'http://localhost:3000/uploads/'+link} alt="" />
                                {/* <div className="absolute">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
</svg>


                                </div> */}

                                </div>
                            ))}
                            <label className="cursor-pointer flex items-center justify-center border bg-transparent rounded-2xl p-2 text-2xl text-gray-600">
                            
                            
                                {/* unfishied work for upload by device */}

                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15" />
                                </svg>
                                <input type="file" className="hidden" />
                                Upload
                            </label>
                        </div>

                        {preInput('Description', 'Description of the place')}
                        <textarea value={description} onChange={ev=> setDescription(ev.target.value)} />

                        {preInput('Perks', 'Mention all perks of the place')}
                            <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">

                              <PERKS selected={perks} onChange={setPerks}></PERKS>
                            </div>

                     

                       

                        {preInput('Extra Info', 'House Rules etc')}
                        <textarea value={extraInfo} onChange={ev=> setExtraInfo(ev.target.value)}/>

                        {preInput('Check in & out times', 'Add check-in and check-out times')}
                        <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
                        <div >
                            <h3 className="mt-2 -mg-1">CheckIn time</h3 >
                            <input type="text"
                             value={checkIn} 
                             onChange={ev=>setCheckIn(ev.target.value)}  placeholder="14:00"/>
                        </div>
                        <div>
                            <h3 className="mt-2 -mg-1"  >CheckOut time</h3 >
                            <input type="text" 
                            value={checkOut} 
                            onChange={ev=>setCheckOut(ev.target.value)} placeholder="12:00"/>
                        </div>
                        <div>
                            <h3 className="mt-2 -mg-1" >Maximum guests allowed</h3 >
                            <input type="number" 
                            value={ maxGuests}
                             onChange={ev=> setMaxGuests(ev.target.value)}/>
                        </div>

                        <div>
                            <h3 className="mt-2 -mg-1" >Price per night</h3 >
                            <input type="number" 
                            value={ price}
                             onChange={ev=> setPrice(ev.target.value)}/>
                        </div>

                        </div>

                        <div>
                            <button className="primary my-4">Save</button>
                        </div>
                    </form>
                </div>
    )

}


 