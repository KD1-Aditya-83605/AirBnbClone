import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import {Route, Routes} from 'react-router-dom'
import './App.css'
import IndexPage from './pages/indexPage'
import LoginPage from './pages/LoginPage'
import Layout from './Layout'
import Register from './pages/RegisterPage'
import RegisterPage from './pages/RegisterPage'
import axios from 'axios'
import { UserContextProvider } from './UserContext'
import ProfilePage from './pages/ProfilePage'
import PlacesPage from './pages/PlacesPage'
import PlacesFormPage from './pages/PlacesFormPage'
import PlacePage from './pages/PlacePage'
import BookingsPage from './pages/Bookings'
import BookingPage from './pages/BookingPage'

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
axios.defaults.withCredentials = true;



function App() {
 
  return (
    <>
    <UserContextProvider>
  <Routes>
    <Route path='/' element={<Layout/>}>

     <Route index element={<IndexPage/>} />
     <Route path='/login' element={<LoginPage/>} /> 
     <Route path='/register' element={<RegisterPage/>} />
     <Route path='/account/' element={<ProfilePage/>} />
     <Route path='/account/places' element={<PlacesPage/>} />
     <Route path='/account/places/new' element={<PlacesFormPage/>} />

     <Route path='/account/places/:id' element={<PlacesFormPage/>} />
     <Route path='/place/:id'element={<PlacePage/>} />
     <Route path='/account/bookings' element={<BookingsPage/>} ></Route>
     <Route path='/account/bookings/:id' element={<BookingPage/>}></Route>
     
     </Route>


    </Routes>
    </UserContextProvider>
   
 

  </>

  )
  

  
}

export default App
