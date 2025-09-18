import React, { useEffect, useState } from 'react';
import Loading from '../../components/Loading';
import Title from '../../components/Title';
import formatDateTime from '../../lib/DateCalculate';
import BlurCircle from '../../components/BlurCircle';
import { useAppContext } from '../../context/Appcontext';
import toast from 'react-hot-toast';

const Listbookings = () => {
  const { axios, getToken, user } = useAppContext();
  const currency = import.meta.env.VITE_CURRENCY;
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchbookings = async () => {
    try {
      const { data } = await axios.get('/api/admin/getallbookings', {
        headers: {
          Authorization: `Bearer ${await getToken()}`
        }
      });
      if (data.success) {
        setBookings(data.bookings);
        setLoading(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (user) {
      fetchbookings();
    }
  }, [user]);

  if (loading) return <Loading />;

  return (
    <div className="w-full md:px-4 max-md:px-0 relative">
      <Title text1="List" text2="Bookings" />
      <BlurCircle top="0" left="0" />
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full table-auto border-collapse text-sm text-white rounded-lg overflow-hidden max-md:text-xs">
          <thead>
            <tr className="bg-primary/20 text-left whitespace-nowrap">
              <th className="p-3 text-base font-semibold min-w-[140px]">User Name</th>
              <th className="p-3 text-base font-semibold min-w-[120px]">Movie Name</th>
              <th className="p-3 text-base font-semibold min-w-[120px]">Show Time</th>
              <th className="p-3 text-base font-semibold min-w-[100px]">Seats</th>
              <th className="p-3 text-base font-semibold min-w-[100px]">Amount</th>
            </tr>
          </thead>
          <tbody className="text-sm font-light">
            {bookings.map((show, index) => {
              const seats = show?.bookedseats || [];
              const showData = show?.show || {};
              const movie = showData?.movie || {};
              const showTime = showData?.showDateTime || '';
              const seatCount = seats.length || 0;
              const price = showData?.showprice || 0;
              const userName = show?.user?.name || 'N/A';

              return (
                <tr
                  key={index}
                  className="border-b border-primary/10 bg-primary/5 even:bg-primary/10 whitespace-nowrap"
                >
                  <td className="p-3 max-w-[180px] truncate">{userName}</td>
                  <td className="p-3 max-w-[180px] truncate">{movie?.originalTitle || 'N/A'}</td>
                  <td className="p-3 max-w-[160px] truncate">
                    {formatDateTime(showTime).replace('•', ' at')}
                  </td>
                  <td className="p-3">{seats.join(', ')}</td>
                  <td className="p-3">
                    {currency} {seatCount * price}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Listbookings;
