import { useEffect, useState } from 'react';
import Title from '../../components/Title';
import Loading from '../../components/Loading';
import formatDateTime from '../../lib/DateCalculate';
import BlurCircle from '../../components/BlurCircle';
import { useAppContext } from '../../context/Appcontext';
import toast from 'react-hot-toast';

const Listshow = () => {
  const { axios, getToken, user } = useAppContext();
  const currency = import.meta.env.VITE_CURRENCY;
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchshows = async () => {
    try {
      const { data } = await axios.get('/api/admin/getallshows', {
        headers: {
          Authorization: `Bearer ${await getToken()}`
        }
      })
      if (data.success) {
        setShows(data.showdata);
        setLoading(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchshows();
    }
  }, [user]);

  return !loading ? (
    <>
      <div className="w-full md:px-4 max-md:px-0 relative">
        <Title text1="List" text2="Shows" />
        <BlurCircle top='0' left='0' />
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full table-auto border-collapse text-sm text-white rounded-lg overflow-hidden max-md:text-xs">
            <thead>
              <tr className="bg-primary/20 text-left whitespace-nowrap">
                <th className="p-3 text-base font-semibold min-w-[140px]">Movie Name</th>
                <th className="p-3 text-base font-semibold min-w-[120px]">Show Time</th>
                <th className="p-3 text-base font-semibold min-w-[120px]">Total Bookings</th>
                <th className="p-3 text-base font-semibold min-w-[100px]">Earnings</th>
              </tr>
            </thead>
            <tbody className="text-sm font-light">
              {shows
                .filter((show) => show && show._id && show.movie).map((show, index) => (
                  <tr
                    key={index}
                    className="border-b border-primary/10 bg-primary/5 even:bg-primary/10 whitespace-nowrap"
                  >
                    <td className="p-3 max-w-[180px] truncate">{show.movie.originalTitle}</td>
                    <td className="p-3 max-w-[160px] truncate">{formatDateTime(show.showDateTime).replace('•', ' at')}</td>
                    <td className="p-3">{Object.keys(show.occupiedSeats).length}</td>
                    <td className="p-3">
                      {currency} {Object.keys(show.occupiedSeats).length * show.showprice}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  ) : (
    <Loading />
  );
};

export default Listshow;
