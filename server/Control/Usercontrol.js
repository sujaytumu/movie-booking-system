import { clerkClient } from "@clerk/express";
import Booking from "../models/Booking.js";
import Movie from "../models/Movie.js";


// get the bookings
export const getUserbookings = async (req, res) => {
    try {
        const user = req.auth().userId;
        const bookings = await Booking.find({ user }).populate({
            path: 'show',
            populate: {
                path: 'movie'
            }
        }).sort({ createdAt: -1 })
        res.json({ success: true, bookings })
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Update user favorites in user metadata
export const updateUserfavorites = async (req, res) => {
  try {
    const { movieId } = req.body;
    const userId = req.auth().userId;

    // Get the existing user data
    const user = await clerkClient.users.getUser(userId);
    const existingFavorites = user.privateMetadata?.favorites || [];

    let updatedFavorites;

    if (!existingFavorites.includes(movieId)) {
      updatedFavorites = [...existingFavorites, movieId];
    } else {
      updatedFavorites = existingFavorites.filter((item) => {
        return item !== movieId
    });
    }

    await clerkClient.users.updateUserMetadata(userId, {
      privateMetadata: {
        favorites: updatedFavorites,
      },
    });

    res.json({
      success: true,
      message: 'Favorites updated successfully',
    });
  } catch (error) {
    console.error('Error in updateUserfavorites:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};


// Get list of favorite movies 
export const getfavorites = async (req, res) => {
    try {
        const userId  = req.auth().userId;
        const user = await clerkClient.users.getUser(userId);
        const favorites = user.privateMetadata.favorites;

        const movies = await Movie.find({_id: {$in : favorites}});
        res.json({success: true, movies});
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
