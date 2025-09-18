import express from 'express';
import {addshow, getmovie, getmovies, getnowplayingMovies, } from '../Control/Showcontrol.js';
import { protectAdmin } from '../Middleware/Auth.js';
const showRouter = express.Router();

// Showsrouter
showRouter.get('/nowplaying', protectAdmin, getnowplayingMovies);
showRouter.post('/add', protectAdmin, addshow);
showRouter.get('/getmovies', getmovies);
showRouter.get('/getmovie/:movieId', getmovie);

export default showRouter;