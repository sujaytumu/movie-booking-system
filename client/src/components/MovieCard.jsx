import { StarIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import timeCalculate from '../lib/TimeCalculate';

const MovieCard = ({movie}) => {
    const navigate = useNavigate();
  return (
    <div className='flex flex-col justify-between p-3 bg-gray-800 rounded-2xl hover:-translate-y-1 transition duration-300 w-66' onClick={() => {navigate(`/movies/${movie._id}`),scrollTo(0,0)}}>
      <img src={movie.primaryImage} alt="Image" className='rounded-lg h-52 w-full object-cover cursor-pointer' />
      <p className='font-semibold mt-2'>{movie.originalTitle}</p>
      <p className='text-sm text-gray-400 mt-2'>
        {new Date(movie.releaseDate).getFullYear()} •  
        {movie.genres.slice(0,2).map((genre) => {
          return genre}).join(" | ")} • {timeCalculate(movie.runtime)}
      </p>
      <div className="flex items-center justify-between mt-4 pb-3">
        <button className='px-4 py-2 text-xs bg-primary hover:bg-primary-dull rounded-full transition font-medium cursor-pointer' onClick={() => {navigate(`/movies/${movie._id}`),scrollTo(0,0)}}>Buy Tickets</button>
        <p className='flex items-center gap-1 mt-2 text-sm text-grap-400 pr-1'>
            <StarIcon className='h-4 w-4 text-primary fill-primary'/>
            {movie.averageRating}
        </p>
      </div>
    </div>
  )
}

export default MovieCard
