import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import User from "../models/User.js";

// Check the user is admin or not
export const isAdmin = async(req,res) => {
    res.json({success: true, isAdmin : true});
}

// API to get dashboard data
export const adminDashboarddata = async(req,res) => {
      try {
          const bookings = await Booking.find({isPaid:true});
          const activeshows = await Show.find({showDateTime : {$gte : new Date()}}).populate('movie');
          const totalUsers = await User.countDocuments();
          const dashboarddata = {
            totalUsers,
            totalRevenue: bookings.reduce((accumulator, booking) => accumulator + booking.amount , 0),
          totalBookings : bookings.length,
          activeshows
        }
        res.json({success: true, dashboarddata})
      } catch (error) {
        res.json({success: false, message: error.message});
      }
}

// API to get all shows
export const getallshows = async(req,res) => {
   try {
        const showdata = await Show.find({showDateTime : { $gte : new Date()}}).populate('movie').sort({showDateTime : 1});
        res.json({success: true, showdata});
   } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export const getbookings = async(req,res) => {
    try {
        const bookings = await Booking.find({}).populate('user').populate({
            path: 'show',
            populate : {
                path: "movie"
            }
        }).sort({createdAt : -1})
        res.json({success: true, bookings})
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}
