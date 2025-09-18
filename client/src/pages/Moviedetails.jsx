import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Heart, PlayCircleIcon, Star, ArrowRight } from 'lucide-react';
import timeCalculate from '../lib/TimeCalculate';
import BlurCircle from '../components/BlurCircle';
import DateSelect from '../components/DateSelect';
import MovieCard from '../components/MovieCard';
import Loading from '../components/Loading';
import toast from 'react-hot-toast';
import { useAppContext } from '../context/Appcontext';

const Moviedetails = () => {
  const { shows, axios, getToken, user, fetchfavorites, favorites } = useAppContext();
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const navigate = useNavigate();

  const getMovie = async () => {
    try {
      const { data } = await axios.get(`/api/show/getmovie/${id}`)
      if (data.success) {
        setShow(data)
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getMovie();
  }, [id]);

  const handleDate = () => {
    return toast('Please choose a date')
  }

  const handlefavorite = async () => {
    try {
      if (!user) {
        return toast.error('Please login to proceed');
      }
      const { data } = await axios.post('/api/user/updatefavorites', { movieId: id }, {
        headers: {
          Authorization: `Bearer ${await getToken()}`
        }
      })
      if (data.success) {
        await fetchfavorites();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  if (!show) {
    return <Loading />;
  }

  const { movie, datetime } = show;

  return show && (
    <div className='px-4 md:px-8 lg:px-16 xl:px-20 py-12 mt-28 max-md:mt-15 overflow-hidden'>
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
        <img
          src={movie.primaryImage}
          alt="Poster"
          className='rounded-xl w-[250px] h-[370px] md:w-[320px] md:h-[450px] object-cover shadow-lg'
          onError={(e) => { e.target.src = '/fallback-image.jpg'; }}
        />
        <div className="text-white relative flex flex-col gap-4 max-w-xl">
          <BlurCircle top="0px" left="50px" />
          <p className='text-xl uppercase text-primary font-medium'>{movie.original_language.includes('en') && 'English'}</p>
          <h1 className='text-4xl font-bold leading-snug'>{movie.originalTitle}</h1>
          <div className="flex items-center gap-2">
            <Star className='fill-primary text-primary w-5 h-5' />
            <p className='text-md text-gray-200'>
              {movie.averageRating ? movie.averageRating : ''} User Rating
            </p>
          </div>
          <p className='text-gray-300 text-sm md:text-base leading-relaxed'>
            {movie.description}
          </p>
          <p className='text-sm text-gray-100 font-medium'>
            {movie.runtime ? timeCalculate(movie.runtime) : ''} • {movie.genres.map((genre) => genre).join(', ')} • {movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : ''}
          </p>
          <div className="flex flex-wrap gap-4 mt-4 max-md:gap-2">
            <a href={movie.trailer && movie.trailer} target="_blank" className="flex items-center px-5 py-2 bg-gray-700 hover:bg-gray-800 transition rounded-lg text-sm font-medium max-md:px-3">
              <PlayCircleIcon className="w-5 h-5 mr-2" />
              Watch Trailer
            </a>
            <a href="#cast" onClick={handleDate} className="px-6 pt-3 bg-primary hover:bg-primary-dull transition rounded-lg text-sm font-medium max-md:px-4">
              Buy Tickets
            </a>
            <a className="p-3 bg-gray-600 rounded-full cursor-pointer" onClick={handlefavorite}>
              <Heart className={`w-5 h-5 ${favorites.some(movie => movie._id === id) ? 'text-primary fill-primary' : ''}`} />
            </a>
          </div>
        </div>
      </div>

      <p className='text-gray-300 font-medium text-lg mt-24 mb-4 max-md:text-base max-md:mt-15'>Movie Cast</p>
      <div id="cast" className='overflow-x-auto no-scrollbar'>
        <div className="flex items-center gap-5 w-max px-1 pb-2">
          {movie.casts.slice(0, 12).map((cast, index) => (
            <div key={index} className="flex flex-col items-center text-center min-w-[80px]">
              <img
                src={cast.primaryImage ? cast.primaryImage : 'no-cast.jpg'}
                alt={cast.name}
                className='rounded-full h-20 w-20 md:h-24 md:w-24 object-cover'
              />
              <p className='text-xs md:text-sm text-white mt-2 font-medium truncate w-20'>{cast.fullName}</p>
            </div>
          ))}
        </div>
      </div>

      <DateSelect datetime={datetime} id={id} />
      <div className='px-6 md:px-8 lg:px-16 xl:px-20 overflow-hidden py-10 max-md:py-0'>
        <div className="relative flex items-center justify-between pt-20 pb-5 pl-10 text-lg max-md:pl-0">
          <BlurCircle top='0' right='-40px' />
          <p className='text-gray-300 font-medium max-md:text-sm text-lg'>You May Also Like</p>
          <button onClick={() => { navigate('/movies') }} className='group flex items-center gap-2 pr-20 max-md:pr-0 text-sm max-md:text-sm text-gray-300 cursor-pointer'>View All
            <ArrowRight className='w-4 h-4 group-hover:translate-x-0.5 transition' />
          </button>
        </div>
        <div className=' flex flex-wrap max-sm: justify-center gap-8 mt-8'>
          {shows
            ?.filter((s) => s && s._id).slice(0, 4).map((show) => {
              return <MovieCard key={show._id} movie={show} />
            })}
        </div>
        <div className='flex justify-center mt-10 max-md:mt-0'>
          <button onClick={() => { scrollTo(0, 0), navigate('/movies') }} className='px-10 py-3 text-md bg-primary hover:bg-primary-dull rounded-full transtion font-medium cursor-pointer max-md:px-5 max-md:text-sm my-5'>Show more</button>
        </div>
      </div>
    </div>
  )
}

export default Moviedetails;
