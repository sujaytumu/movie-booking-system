import Navbar from './components/Navbar'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Movies from './pages/Movies'
import Moviedetails from './pages/Moviedetails'
import SeatLayout from './pages/SeatLayout'
import MyBooking from './pages/MyBooking'
import Favourite from './pages/Favourite'
import Footer from './components/Footer'
import { Toaster } from 'react-hot-toast'
import Layout from './pages/admin/Layout'
import Dashboard from './pages/admin/Dashboard'
import Addshow from './pages/admin/Addshow'
import Listshow from './pages/admin/Listshow'
import Listbookings from './pages/admin/Listbookings'
import { useAppContext } from './context/Appcontext'
import { SignIn } from '@clerk/clerk-react'
import Loading from './components/Loading'

const App = () => {
  const {user} = useAppContext();
  const isadminpanel = useLocation().pathname.startsWith('/admin');
  return (
    <>
      <Toaster/>
      {!isadminpanel && <Navbar />}
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/movies" element={<Movies />} />
        <Route exact path="/movies/:id" element={<Moviedetails />} />
        <Route exact path="/movies/:id/:date" element={<SeatLayout />} />
        <Route exact path="/my-bookings" element={<MyBooking />} />
        <Route exact path="/loading/:nextUrl" element={<Loading/>} />
        <Route exact path="/favourites" element={<Favourite />} />
      <Route exact path="/admin/*" element={user ? <Layout/> : (
        <div className='min-h-screen flex items-center justify-center'>
          <SignIn fallbackRedirectUrl={'/admin'}/>
        </div>
      )}>
          <Route index element={<Dashboard/>}/>
          <Route exact path="add-shows" element={<Addshow/>}/>
          <Route exact path="list-shows" element={<Listshow/>}/>
          <Route exact path="list-bookings" element={<Listbookings/>}/>
      </Route>
      </Routes>
      {!isadminpanel && <Footer />}
    </>
  )
}

export default App
