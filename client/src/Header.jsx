import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from './UserContext'

export default function Header(){
  const {user} =useContext(UserContext)

    return(
        <header className='flex justify-between'>
        <Link to={'/'} className='flex items-center gap-1'>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 -rotate-90">
  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
  </svg>
    
    <span className='font-bold text-xl'>AirBnb</span>
  
  
  
        </Link>
  
        <div className='flex gap-2 border border-gray-300 rounded-full p-1 px-4 shadow-md shadow-gray-300'> 
          <div>Anywhere</div>
          <div className="border-l border-gray-300"></div>
          <div>Any Week</div>
          <div className="border-l border-gray-300"></div>
          <div>Add Guests</div>
          <button className='bg-primary text-white p-2 rounded-full'>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
    </svg>
</button>

        </div>
  
        <Link to={user?'/account':'/login'} className='flex itemx-center gap-2 border border-gray-300 rounded-full p-2 px-4'>
  
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
  
  <div className='bg-gray-500 text-white rounded-full border border-gray-500 overflow-hidden'>
  
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 relative top-1">
  <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
  </svg>
  
  
  </div>
  
  
  {!!user &&(
    <div>
        {user.name}
    </div>
  )}
  
  
        </Link>
  
      </header>
    )
}