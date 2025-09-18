import { useEffect, useState } from 'react';
import BlurCircle from '../components/BlurCircle';
import { StarIcon } from 'lucide-react';
import time from '../lib/Time';
import formatDateTime from '../lib/DateCalculate';
import { useAppContext } from '../context/Appcontext';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const MyBooking = () => {
  const {axios,getToken,user} = useAppContext();
  const currency = import.meta.env.VITE_CURRENCY;
  const [bookings, setBookings] = useState([]);

  const getBooking = async () => {
    try {
      const {data} = await axios.get('/api/user/userbookings', {
      headers : {
                Authorization : `Bearer ${await getToken()}`
            }})
          if(data.success) {
            setBookings(data.bookings);
          } else {
            toast.error(data.message);
          }
    } catch (error) {
      console.log(error);
    }

  };

  useEffect(() => {
    if(user) {
      getBooking();
    }
  }, [user]);

  return bookings.length > 0 ? (
    <div className="relative mt-20 px-4 sm:px-6 md:px-14 lg:px-24 pt-10 min-h-[70vh] mb-10 max-md:mt-15">
      <BlurCircle top="0" left="0" />
      <BlurCircle bottom="0" right="80vh" />

      <h1 className="text-lg sm:text-xl font-medium text-gray-300 mb-6">Your Bookings</h1>

      <div className="flex flex-wrap gap-6 justify-start">
        {bookings.map((data, index) => {if (!data.show?.movie) return null;
          return (<div
            key={index}
            className="w-full md:w-[48%] bg-primary/5 border border-primary/20 rounded-xl p-3 flex flex-col gap-4"
          >
            <div className="flex gap-4">
              <img
                src={data.show.movie.primaryImage}
                alt="Poster"
                className="w-24 h-36 object-cover rounded-lg"
              />
              <div className="flex flex-col justify-between text-white text-sm">
                <h1 className="text-3xl font-semibold">{data.show.movie.originalTitle}</h1>
                <p>{time(data.show.movie.runtime)}</p>
                <p className="flex items-center gap-1">
                  <StarIcon className="w-4 h-4 text-primary fill-primary" />
                  {data.show.movie.averageRating}
                </p>
                <p className='text-md'>{formatDateTime(data.show.showDateTime)}</p>
              </div>
            </div>

            <div className="text-white text-sm flex flex-col gap-1 px-1">
              <div className='flex gap-4'>
              <p className="font-semibold text-2xl">
                {currency} {data.amount}
              </p>
              {!data.isPaid && <Link to={data.paymentLink} className='px-4 py-1.5 mb-2 text-sm bg-primary hover:bg-primary-dull rounded-full transition font-medium cursor-pointer'>Pay Now</Link>}
              </div>
              <p>Total Tickets: <span className="font-semibold">{data.bookedseats.length}</span></p>
              <p>
                Seat Numbers:{' '}
                <span className="font-semibold">{data.bookedseats.join(', ')}</span>
              </p>
            </div>
          </div>
        )})}
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center text-gray-400 min-h-screen text-4xl max-md:text-3xl font-semibold">No bookings found</div>
  )
};

export default MyBooking;
