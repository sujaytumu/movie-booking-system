import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import BlurCircle from './BlurCircle';
import MovieCard from './MovieCard';
import { useAppContext } from '../context/Appcontext';

const MovieFeatured = () => {
  const {shows} = useAppContext();
  const navigate = useNavigate();
  return (
    <div className='px-6 md:px-8 lg:px-16 xl:px-20 overflow-hidden py-10 max-md:py-0'>
       <div className="relative flex items-center justify-between pt-20 pb-5 pl-10 text-lg max-md:pl-0">
        <BlurCircle top='0' right='-40px'/>
        <p className='text-gray-300 font-medium max-md:text-sm text-lg'>Now Showing</p>
        <button onClick={()=> {navigate('/movies'),scrollTo(0,0)}} className='group flex items-center gap-2 pr-20 max-md:pr-0 text-sm max-md:text-sm text-gray-300 cursor-pointer'>View All 
          <ArrowRight className='w-4 h-4 group-hover:translate-x-0.5 transition'/>
        </button>
       </div>
       <div className=' flex flex-wrap max-sm: justify-center gap-8 mt-8'>
         {shows?.filter(Boolean).slice(0,4).map((show) => {
           return <MovieCard key={show._id} movie={show}/> 
         })}
       </div>
       <div className='flex justify-center mt-10 max-md:mt-0'>
         <button onClick={() => {navigate('/movies'),scrollTo(0,0)}} className='px-10 py-3 text-md bg-primary hover:bg-primary-dull rounded-full transtion font-medium cursor-pointer max-md:px-5 max-md:text-sm my-5'>Show more</button>
       </div>
    </div>
  )
}

export default MovieFeatured
