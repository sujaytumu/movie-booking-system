import React from 'react'
import HeroSection from '../components/HeroSection'
import MovieFeatured from '../components/MovieFeatured'
import MovieTrailer from '../components/MovieTrailer'

const Home = () => {
  return (
    <div>
      <HeroSection />
      <MovieFeatured/>
      <MovieTrailer/>
    </div>
  )
}

export default Home
