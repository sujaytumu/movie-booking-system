import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MenuIcon, SearchIcon, TicketPlus, XIcon } from 'lucide-react'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
import { useAppContext } from '../context/Appcontext'

const Navbar = () => {
  const { favorites } = useAppContext();
  const [isOpen, setisOpen] = useState(false);
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const navigate = useNavigate();
  return (
    <div className='fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-8 lg:px-16 py-5'>
      <Link to='/' onClick={() => { scrollTo(0,0)}} className='max-md:flex-1'>
        <img src="/navlogo.png" alt="Logo" className='h-auto w-40' />
      </Link>
      <div className={`max-md:absolute max-md:top-0 max-md:-left-10 max-md:font-medium max-md:text-lg z-50 flex flex-col md:flex-row items-center max-md:justify-center gap-6 min-md:px-6 py-3 max-md:px-3 max-md:h-screen min-md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 md:border border-gray-300/20 overflow-hidden transition-[width] duration-300 ${isOpen ? 'max-md:w-full' : 'max-md:w-0'}`}>
        <XIcon className='min-md:hidden absolute top-6 right-6 w-8 h-8 cursor-pointer' onClick={() => { setisOpen(false) }} />
        <Link to="/" onClick={() => { scrollTo(0,0); setisOpen(false) }} className='hover:text-primary'>Home</Link>
        <Link to="/movies" onClick={() => { scrollTo(0,0); setisOpen(false) }} className='hover:text-primary'>Movies</Link>
        {favorites.length > 0 && <Link to="/favourites" onClick={() => { scrollTo(0,0); setisOpen(false) }} className='hover:text-primary'>Favourite</Link>}
        <Link to="/my-bookings" onClick={() => { scrollTo(0,0); setisOpen(false) }} className='hover:text-primary'>Bookings</Link>
        <Link to="/admin" onClick={() => { scrollTo(0,0); setisOpen(false) }} className='text-primary'>Dashboard</Link>
      </div>
      <div className='w-40 flex items-center justify-around'>
        <SearchIcon className='max-md:hidden w-6 h-6 mr-4' />
        {!user ? (<button onClick={openSignIn} className='sm:px-7 sm:py-2 bg-primary hover:bg-primary-dull transition px-4 py-1 rounded-full font-medium cursor-pointer max-md:text-sm'>Login</button>) :
          (<UserButton>
            <UserButton.MenuItems>
              <UserButton.Action label='My Bookings' labelIcon={<TicketPlus width={15} />} onClick={() => { navigate('/my-bookings') }} />
            </UserButton.MenuItems>
          </UserButton>)}
      </div>
      <MenuIcon className='min-md:hidden w-8 h-8 cursor-pointer' onClick={() => { setisOpen(true) }} />
    </div>
  )
}

export default Navbar
