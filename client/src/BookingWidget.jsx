import { useState } from "react"
import {differenceInCalendarDays} from 'date-fns';
import axios from "axios";
import { Navigate } from "react-router-dom";


export default function BookingWidget({place}){
    const[checkIn,setCheckIn] = useState('');
    const[checkOut,setCheckOut] = useState('');
    const[numberOfGuests,setNumberOfGuests] = useState(1);
    const[name,setName] = useState('');
    const[mobile,setMobile] = useState('');
    const[redirect,setRedirect] = useState('');


    let numberOfDays = 0;
    if(checkIn && checkOut){
       numberOfDays = differenceInCalendarDays(new Date(checkOut),new Date(checkIn));
    }

    console.log(numberOfDays);


    async function bookThisPlace(){
       
        const data = {checkIn,checkOut,numberOfGuests,name,mobile,place:place._id,price:numberOfDays*place.price};
        
         await  axios.post('/bookings',data);
      

      const bookingId = place._id;

      setRedirect('/account/bookings/'+bookingId);   

    }

    if(redirect){return <Navigate to={redirect}/>}


    return(
        <div className="bg-white-300 shadow p-4 rounded-2xl">
        <div className="text-2xl text-center">
        Price: ${place.price} / night
        </div>
 
        <div className="border rounded-2xl mt-4">

            <div className="flex">

            <div className="py-3 px-4">
            <label>Check In: </label>
            <input type="date" value={checkIn} 
            onChange={ev => setCheckIn(ev.target.value)} /> 
        </div>
        <div className=" py-3 px-4 border-l "> 
            <label>Check Out: </label>
            <input type="date" value={checkOut}
             onChange={ev=> setCheckOut(ev.target.value)} />
        </div>


            </div>

            <div className=" py-3 px-4 border-t "> 
            <label>Number of guests: </label>
            <input type="number" value={numberOfGuests} onChange={ev=> setNumberOfGuests(ev.target.value)}  />
        </div>

        {numberOfDays >0 &&(
            <div className="">
            <div className=" py-3 px-4 border-t "> 
            <label>Name: </label>
            <input type="text" placeholder="your name" value={name} onChange={ev=> setName(ev.target.value)}  />
            <label>Contact No: </label>
            <input type="tel" placeholder="your phone " value={mobile} onChange={ev=> setMobile(ev.target.value)}  />
        </div>

            </div> 

        )}




            



        
        
 

        </div>

        
        <button onClick={bookThisPlace} className="primary mt-4">Book This Place
        {numberOfDays >0 &&(
            <span> ${numberOfDays * place.price}</span>
        ) }
        </button>

    </div>
    )
}