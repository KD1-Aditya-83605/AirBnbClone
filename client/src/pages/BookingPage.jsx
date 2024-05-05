import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddressLink from "../AddressLink";
import PlaceGallery from "../PlaceGallery";
import { differenceInCalendarDays, format } from "date-fns";

export default function BookingPage(){
    const{id} = useParams();
    const[booking,setBooking] = useState(null);

    useEffect(()=>{

        if(id){
            axios.get('/bookings').then(responce=>{
               const foundBooking =  responce.data.find(({_id})=> _id === id)

               if(foundBooking){
                setBooking(foundBooking);
            }
            else{
                setBooking(null)
            }
            }
            )

            
        }

    },[id])


    if(!booking){
        return '';
    }

    return(
        <div className="my-8">

<h1 className="text-3xl">{booking.place.title}</h1>
<AddressLink className='my-2 block'>{booking.place.address}
</AddressLink>
<div className="bg-gray-200 p-4 mb-4 rounded-2xl">
    <h2 className="text-xl">Your booking information</h2>
   
    <div className="text-xl">

    <div>

{format(  new Date(booking.checkIn),'yyyy-MM-dd')} to { format( new Date( booking.checkOut),'yyyy-MM-dd')} 
</div>


{differenceInCalendarDays(new Date(booking.checkOut),new Date(booking.checkIn))} nights 
| Total Price: ${booking.price}
</div>
</div>




 
<PlaceGallery place={booking.place}/>

        </div>
    )
}