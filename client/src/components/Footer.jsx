import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <>
      <div className='px-4 sm:px-6 md:px-10 xl:px-20'>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10 border-b border-white py-10">
          
          <div className='flex flex-col gap-4 max-w-md'>
            <img src="/navlogo.png" alt="Logo" className='w-32 sm:w-40' />
            <p className="text-gray-300 sm:text-sm">
              Book movie tickets online with ease, explore upcoming releases, and catch the latest trailers.
            </p>
            <div className="flex gap-3 flex-wrap">
              <img src={assets.googlePlay} className="w-24 sm:w-28" alt="Google Play" />
              <img src={assets.appStore} className="w-24 sm:w-28" alt="App Store" />
            </div>
          </div>

          <div className="flex flex-wrap gap-12 text-gray-300"> 
            <div className="flex flex-col gap-2 sm:text-sm max-md:text-xs py-4">
              <p className="font-semibold text-base sm:text-xs">Company</p>
              {['Home', 'About us', 'Contact us', 'Privacy policy'].map((item, i) => (
                <p
                  key={i}
                  className="cursor-pointer hover:underline"
                  onClick={() => scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  {item}
                </p>
              ))}
            </div>

            <div className="flex flex-col gap-2 sm:text-sm max-md:text-xs py-4">
              <p className="font-semibold text-base sm:text-sm">Get in touch</p>
              <p className="cursor-pointer hover:underline">+1-234-567-890</p>
              <p className="cursor-pointer hover:underline">contact@example.com</p>
            </div>

          </div>
        </div>
      </div>

      <p className="text-center sm:text-sm max-md:text-xs py-4 text-gray-400">
        © {new Date().getFullYear()} QuickShow. All Rights Reserved.
      </p>
    </>
  );
};

export default Footer;
