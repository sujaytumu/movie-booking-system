import {
  ChartLineIcon,
  IndianRupeeIcon,
  PlayCircleIcon,
  StarIcon,
  UsersIcon
} from 'lucide-react';
import { useEffect, useState } from 'react';
import Loading from '../../components/Loading';
import Title from '../../components/Title';
import BlurCircle from '../../components/BlurCircle';
import formatDateTime from '../../lib/DateCalculate';
import { toast } from 'react-hot-toast';
import { useAppContext } from '../../context/Appcontext';

const Dashboard = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeshows: [],
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const { axios, getToken, user } = useAppContext();

  const fetchDashboardData = async () => {
    try {
      const { data } = await axios.get('/api/admin/dashboarddata', {
        headers: {
          Authorization: `Bearer ${await getToken()}`
        }
      })
      if (data.success) {
        setDashboardData(data.dashboarddata);
        setLoading(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);


  if (!dashboardData) {
    return (
      <Loading />
    );
  }

  const dashboardCards = [
    {
      title: 'Total Bookings',
      value: dashboardData.totalBookings,
      icon: ChartLineIcon
    },
    {
      title: 'Total Revenue',
      value: `${currency} ${dashboardData.totalRevenue}`,
      icon: IndianRupeeIcon
    },
    {
      title: 'Active Shows',
      value: dashboardData.activeshows.length,
      icon: PlayCircleIcon
    },
    {
      title: 'Total Users',
      value: dashboardData.totalUsers,
      icon: UsersIcon
    }
  ];

  return !loading ? (
    <div>
      <Title text1="Admin" text2="Dashboard" />
      <div className='relative'>
        <BlurCircle top='0' left='0' />
      </div>
      <div className='grid grid-cols-2 min-lg:grid-cols-4 gap-6 max-md:gap-1 mt-8 max-md:pl-5 max-sm:pl-0'>
        {dashboardCards.map((data, index) => {
          return (<div key={index} className='flex justify-between rounded-lg bg-primary/10 border-2 border-primary/20'>
            <div className='flex flex-col py-4 items-start justify-center pr-5 pl-4'>
              <p className='text-sm'>{data.title}</p>
              <p className='text-2xl font-semibold pt-1 max-md:text-xl'>{data.value}</p>
            </div>
            <div className='flex items-center justify-center pr-3'>
              <data.icon className="w-7 h-7" />
            </div>
          </div>)
        })}
      </div>
      <p className='mt-10 text-xl font-semibold'>Active Shows</p>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mt-8 px-2 sm:px-5'>
        {dashboardData.activeshows.length > 0 ? (dashboardData.activeshows
          .filter((movie) => movie?.movie?.primaryImage && movie?.movie?.originalTitle).map((movie, index) => (
            <div key={index} className='flex flex-col rounded-lg bg-primary/10 border-2 border-primary/20 overflow-hidden shadow-md hover:-translate-y-1 transition duration-300'>
              <img
                src={movie.movie.primaryImage}
                alt="poster"
                className='w-full h-64 object-cover'
              />
              <p className='pt-3 px-3 text-lg font-semibold text-white'>
                {movie.movie.originalTitle.length > 25
                  ? movie.movie.originalTitle.slice(0, 25) + '...'
                  : movie.movie.originalTitle}
              </p>
              <div className='flex justify-between mt-2 px-3 text-white'>
                <p className='text-lg font-medium'>{currency} {movie.showprice}</p>
                <p className='flex items-center gap-1 text-gray-300 text-sm'>
                  <StarIcon className="w-4 h-4 text-primary fill-primary" />
                  {movie.movie.averageRating}
                </p>
              </div>
              <p className='px-3 py-3 text-sm text-gray-500'>
                {formatDateTime(movie.showDateTime).replace('•', ' at')}
              </p>
            </div>
          ))) : (
          <p className='text-white'>No active shows found.</p>
        )}
      </div>
    </div>
  ) : <Loading />
};

export default Dashboard;
