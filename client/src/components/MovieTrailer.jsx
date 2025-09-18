import { useState } from 'react';
import BlurCircle from './BlurCircle';
import { dummyTrailers } from '../assets/assets';
import { PlayCircleIcon } from 'lucide-react';

const MovieTrailer = () => {
  const [currentVideo, setCurrentVideo] = useState(dummyTrailers[0]);

  return (
    <div className='px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20 py-10 overflow-hidden'>
      <p className='text-gray-300 font-medium text-lg max-md:text-sm max-w-lg pl-6 sm:pl-0'>
        Trailers
      </p>

      <div className="relative mt-6">
        <BlurCircle top='0px' left='-100px' />
      </div>


      <div className="relative w-full max-w-6xl mx-auto mt-10">
        <div className="relative pt-[56.25%] w-full">
          <iframe
            src={currentVideo.videoUrl + "?rel=0"}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full rounded-lg"
          />
        </div>
      </div>

      <div className="relative">
        <BlurCircle top='-150px' right='80px' />
      </div>


      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-8 max-w-5xl mx-auto px-2'>
        {dummyTrailers.map((trailer, index) => (
          <div
            key={index}
            className='relative group transition-transform transform hover:-translate-y-1 cursor-pointer'
            onClick={() => setCurrentVideo(trailer)}
          >
            <img
              src={trailer.image}
              alt={`Trailer thumbnail ${index + 1}`}
              className='rounded-lg w-full h-full object-cover brightness-75'
            />
            <PlayCircleIcon
              strokeWidth={1.6}
              className='absolute top-1/2 left-1/2 w-6 h-6 md:w-8 md:h-8 transform -translate-x-1/2 -translate-y-1/2 text-white'
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieTrailer;
