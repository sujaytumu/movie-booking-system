import axios from 'axios'
import Movie from '../models/Movie.js';
import Show from '../models/Show.js';
import { inngest } from '../Inngest/index.js';

// Get 250 top movies from IMDB RapidAPI
export const getnowplayingMovies = async (req, res) => {
  try {
    const { data } = await axios.get('https://imdb236.p.rapidapi.com/api/imdb/most-popular-movies', {
      headers: {
        'x-rapidapi-host': "imdb236.p.rapidapi.com",
        'x-rapidapi-key': `${process.env.X_RAPIAPI_KEY}`
      },
    })
    const movies = data;
    res.json({ success: true, movies: movies });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}

// Admin can add any movie from that 250 movies to database
export const addshow = async (req, res) => {
  try {
    const { movieId, showsInput, showprice } = req.body;
    let movie = await Movie.findById(movieId);

    if (!movie) {
      const moviedataResponse = await axios.get(`https://imdb236.p.rapidapi.com/api/imdb/${movieId}`, {
        headers: {
          'x-rapidapi-host': "imdb236.p.rapidapi.com",
          'x-rapidapi-key': `${process.env.X_RAPIAPI_KEY}`
        }
      })

      const moviedata = moviedataResponse.data;

      const movieDetails = {
        _id: moviedata.id,
        originalTitle: moviedata.originalTitle,
        description: moviedata.description,
        primaryImage: moviedata.primaryImage,
        thumbnails: moviedata.thumbnails,
        trailer: moviedata.trailer,
        releaseDate: moviedata.releaseDate,
        original_language: moviedata.spokenLanguages,
        genres: moviedata.genres,
        casts: moviedata.cast,
        averageRating: moviedata.averageRating,
        runtime: moviedata.runtimeMinutes,
        numVotes: moviedata.numVotes
      };

      movie = await Movie.create(movieDetails);
    }

    const showstoCreate = [];
    showsInput.forEach((show) => {
      const showdate = show.date;
      const time = show.time;
      const datetimeString = `${showdate}T${time}`;
      showstoCreate.push({
        movie: movieId,
        showDateTime: new Date(datetimeString),
        showprice,
        occupiedSeats: {},
      });
    });


    if (showstoCreate.length > 0) {
      await Show.insertMany(showstoCreate);
    }

    await inngest.send({
      name : 'app/show.added',
      data : {movieId : movie._id}
    })

    res.json({ success: true, message: "Show(s) added successfully." });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get all unique movies from database
export const getmovies = async (req, res) => {
  try {
    const shows = await Show.find({ showDateTime: { $gte: new Date() } }).populate('movie').sort({ showDateTime: 1 });
    const uniqueshows = new Set(shows.map((show) => show.movie));

    res.json({ success: true, shows: Array.from(uniqueshows) });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}

// Get Single movie from database
export const getmovie = async (req, res) => {
  try {
    const { movieId } = req.params;
    const shows = await Show.find({ movie: movieId, showDateTime: { $gte: new Date() } });
    const movie = await Movie.findById(movieId);
    const datetime = {};

    shows.forEach((show) => {
      const date = show.showDateTime.toISOString().split('T')[0];
      if (!datetime[date]) {
        datetime[date] = [];
      }
      datetime[date].push({ time: show.showDateTime, showId: show._id })
    })
    res.json({ success: true, movie, datetime })
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}

