import { useState } from 'react';
import BlurCircle from './BlurCircle';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const DateSelect = ({ datetime, id }) => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const onDateCheck = () => {
    if (!selected) {
      toast.error('Please choose a date');
    } else {
      navigate(`/movies/${id}/${selected}`);
      scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="pt-24 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 ">
      <div className="relative flex flex-col md:flex-row items-center justify-center gap-8 sm:gap-10 p-6 sm:p-8 bg-primary/10 border border-primary/20 rounded-lg">
        <BlurCircle top="-50px" left="100px" />

        <div className="w-full text-white">
          <p className="text-lg font-semibold mb-8 max-md:text-center">Choose Date</p>
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar">
            <div className="flex gap-4 min-w-0 min-md:max-w-90 overflow-scroll no-scrollbar max-md:gap-2">
              {Object.keys(datetime).map((date) => {
                const d = new Date(date);
                return (
                  <button
                    key={date}
                    onClick={() => setSelected(date)}
                    className={`flex flex-col items-center justify-center min-w-[56px] h-16 aspect-square rounded cursor-pointer
                      ${selected === date
                        ? 'bg-primary text-white'
                        : 'border border-primary/70 text-white hover:bg-primary/10'}`}
                  >
                    <span className="text-lg font-medium">{d.getDate()}</span>
                    <span className="text-sm">{d.toLocaleDateString('en-IN', { month: 'short' })}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <button
          onClick={onDateCheck}
          className="mt-4 md:mt-0 px-6 py-2 bg-primary hover:bg-primary/90 transition rounded-lg text-md font-medium w-36 mix-[768px]:px-80"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default DateSelect;
