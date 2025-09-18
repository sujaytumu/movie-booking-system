import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { assets } from '../assets/assets';
import Loading from '../components/Loading';
import { ArrowRight, ClockIcon } from 'lucide-react';
import timeFormat from '../lib/TimeFormat';
import BlurCircle from '../components/BlurCircle';
import toast from 'react-hot-toast';
import { useAppContext } from '../context/Appcontext';

const SeatLayout = () => {
  const { axios, getToken, user } = useAppContext();
  const { id, date } = useParams();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [show, setShow] = useState(null);
  const [occupiedSeats,setOccupiedSeats] = useState([]);
  const navigate = useNavigate();
  const groupRows = [['A', 'B'], ['C', 'D'], ['E', 'F'], ['G', 'H', 'I'], ['J', 'K', 'L']];

  const fetchshow = async () => {
    try {
      const { data } = await axios.get(`/api/show/getmovie/${id}`);
      if (data.success) {
        setShow(data)
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getoccupiedSeats = async() => {
    try {
      const {data} = await axios.get(`/api/booking/seats/${selectedTime.showId}`);
      if(data.success) {
        setOccupiedSeats(data.occupiedSeats)
    } else {
      toast.error(data.message);
    }
    } catch (error) {
      console.log(error);
    }
  }

  const createBooking = async() => {
    try {
      if(!user) {
        return toast.error('Please login to proceed');
      }

      if(!selectedTime || !selectedSeats.length) {
        return toast.error('Please select time and seat first');
      }

      const {data} = await axios.post(`/api/booking/create`, {showId : selectedTime.showId , selectedSeats}, {
        headers : {
                Authorization : `Bearer ${await getToken()}`
            }})
            if(data.success) {
              window.location.href = data.url;
            }else {
              toast.error(data.message);
            }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
      fetchshow();
  }, []);

  useEffect(() => {
    if(selectedTime) {
      getoccupiedSeats();
    }
  },[selectedTime])

  if (!show) {
    return <Loading />;
  }

  const handleSeatClick = (seatId) => {
    if (!selectedTime) {
      return toast('Please select time first');
    }
    if (!selectedSeats.includes(seatId) && selectedSeats.length > 4) {
      return toast('You can only select 5 seats');
    }
    if(occupiedSeats.includes(seatId)) {
        return toast.error('Seat is already booked')
    }
    setSelectedSeats(prev => prev.includes(seatId) ? prev.filter(seat => seat !== seatId) : [...prev, seatId])
  }

  const renderSeats = (row, count = 9) => {
    return (
      <div key={row} className='w-full flex justify-center mb-3'>
        <div className='grid grid-cols-9 gap-1 sm:gap-2 md:gap-3'>
          {Array.from({ length: count }, (_, i) => {
            const seatId = `${row}${i + 1}`;
            const isSelected = selectedSeats.includes(seatId);
            return (
              <button
                key={seatId}
                onClick={() => handleSeatClick(seatId)}
                className={`aspect-square rounded border border-primary/60 text-xs md:text-base transition ${selectedSeats.includes(seatId) && 'bg-primary text-white'
                  } 
              w-8 md:w-8 lg:w-10 @max-xs:w-6 ${occupiedSeats.includes(seatId) && 'opacity-30'}`}
                title={seatId}
              >
                {seatId}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className='flex flex-col xl:flex-row px-6 md:px-16 lg:px-24 py-12 mt-30 md:pt-10 max-sm:mt-10'>
      <div className='relative w-60 bg-primary/10 border border-primary/20 rounded-lg py-10 h-max min-xl:sticky xl:top-30 max-xl:mt-0'>
        <BlurCircle top='-100px' left='0px' />
        <p className='text-lg font-semibold px-6'>Available Timings</p>
        <div className='mt-4 space-y-1'>
          {show.datetime[date].map((item) => (
            <div
              key={item.showId}
              onClick={() => setSelectedTime(item)}
              className={`flex items-center gap-2 px-10 py-2 w-max rounded-r-md cursor-pointer transition ${selectedTime?.showId === item.showId
                ? 'bg-primary text-white'
                : 'hover:bg-primary/20'
                }`}
            >
              <ClockIcon className='w-4 h-4' />
              <p className='text-sm'>{timeFormat(item.time)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className='relative flex flex-1 flex-col items-center max-md:mt-15'>
        <BlurCircle bottom='-40px' right='0' />
        <h1 className='text-3xl font-semibold mb-7'>Select your seat</h1>
        <img src={assets.screenImage} alt="Scrren" />
        <p className='text-sm font-medium'>SCREEN SIDE</p>
        <div className='flex flex-col items-center mt-10 w-full text-white font-medium text-xs'>
          <div className='w-full'>{groupRows[0].map((row) => renderSeats(row))}</div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-8 mt-6 w-full'>
            {groupRows.slice(1).map((group, index) => (
              <div key={index} className='flex flex-col items-center w-full'>
                {group.map((row) => renderSeats(row))}
              </div>
            ))}
          </div>
        </div>
        <div className='flex justify-center mt-10 max-md:mt-0'>
          <button onClick={createBooking} className='flex gap-2 px-8 py-3 text-md bg-primary hover:bg-primary-dull rounded-full transtion font-medium cursor-pointer max-md:px-5 max-md:text-sm my-5 max-md:pb-2'>Proceed to checkout<ArrowRight className='hover:translate-x-1 transition duration-300 max-md:w-5 max-md:pb-1' /></button>
        </div>
      </div>
    </div>
  );
};

export default SeatLayout;
