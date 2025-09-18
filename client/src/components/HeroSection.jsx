import { ArrowRight, Calendar1Icon, ClockIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const HeroSection = () => {
    const navigate = useNavigate();
    return (
        <div className='flex flex-col items-start justify-center gap-8 px-10 md:px-14 lg:px-23 bg-[url("/backgroundImage.jpg")] bg-cover bg-center h-screen max-md:overflow-hidden max-md:bg-[url("/mobileback.jpg")] max-md:bg-center max-md:bg-cover'>
            <div className="flex flex-col items-start justify-center max-md:text-sm mt-10 min-2xl:text-xl">
                <img src="/MarvelLogo.png" alt="Logo" className='w-60 mx-2 max-md:w-40' />
                <h1 className='text-6xl md: leading-18 max-w-120 font-semibold li mx-2 max-md:text-3xl max-md:leading-10'>MOON KNIGHT</h1>
                <div className="flex mx-3 my-2 gap-6 max-sm:flex-col max-sm:gap-2 text-gray-300 max-md:font-semibold">
                    <span>Action | Adventure | Superhero</span>
                    <div className="flex items-center">
                        <Calendar1Icon className='w-4 h-4 mx-1' />2022
                    </div>
                    <div className="flex items-center">
                        <ClockIcon className='w-4 h-4 mx-1' />5hr 15min
                    </div>
                </div>
                <p className='max-w-md mx-3 max-md:font-semibold min-2xl:max-w-lg text-gray-300 max-md:max-w-sm'>Moon Knight follows Marc Spector, a former mercenary with Dissociative Identity Disorder, who becomes the avatar of the Egyptian moon god Khonshu.</p>
                <button className='flex items-center px-5 py-3 max-md:px-4 text-md min-2xl:my-6 font-medium bg-primary hover:bg-primary-dull transition rounded-full cursor-pointer my-4 mx-3 max-md:text-xs' onClick={() => { navigate('/movies') }}>
                    Explore Movies
                    <ArrowRight className='w-5 h-5 ml-1' />
                </button>
            </div>
        </div>
    )
}

export default HeroSection
