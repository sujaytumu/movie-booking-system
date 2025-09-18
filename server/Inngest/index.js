import { Inngest } from "inngest";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import sendEmail from "../config/nodemailer.js";
import Movie from "../models/Movie.js";


export const inngest = new Inngest({ id: "movie-ticket-booking" });

const userCreated = inngest.createFunction(
    { id: 'create-user' },
    { event: 'clerk/user.created' },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data;
        const userdata = {
            _id: id,
            name: first_name + ' ' + last_name,
            email: email_addresses[0].email_address,
            image: image_url
        }
        await User.create(userdata);
    }
)
const userUpdated = inngest.createFunction(
    { id: 'update-user' },
    { event: 'clerk/user.updated' },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data;
        const userdata = {
            _id: id,
            name: first_name + ' ' + last_name,
            email: email_addresses[0].email_address,
            image: image_url
        }
        await User.findByIdAndUpdate(id, userdata);
    }
)
const userDeleted = inngest.createFunction(
    { id: 'delete-user' },
    { event: 'clerk/user.deleted' },
    async ({ event }) => {
        const { id } = event.data;
        await User.findByIdAndDelete(id);
    }
)

const releaseSeatsandDeletebooking = inngest.createFunction(
    { id: 'relese-seats-delete-booking' },
    { event: 'app/checkpayment' },
    async ({ event, step }) => {
        const tenminutes = new Date(Date.now() + 10 * 60 * 1000);
        await step.sleepUntil('Wait-for-10-minutes', tenminutes);
        await step.run('check-payment-status', async () => {
            const bookingId = event.data.bookingId;
            const booking = await Booking.findById(bookingId);
            if (!booking.isPaid) {
                const show = await Show.findById(booking.show);
                booking.bookedseats.forEach((seat) => {
                    return delete show.occupiedSeats[seat];
                })
                show.markModified('occupiedSeats');
                await show.save();
                await Booking.findByIdAndDelete(booking._id)
            }
        })
    }
)

export const cleanupOldData = inngest.createFunction(
  { id: "cleanup-old-bookings-shows" },
  { cron: "0 0 1 1,7 *" }, // Runs at 00:00 on Jan 1 and Jul 1
  async ({ step }) => {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    return step.run("delete-old-bookings-and-shows", async () => {
      const deletedBookings = await Booking.deleteMany({
        createdAt: { $lt: sixMonthsAgo },
      });

      const deletedShows = await Show.deleteMany({
        showDateTime: { $lt: sixMonthsAgo },
      });

      console.log(
        `Deleted ${deletedBookings.deletedCount} old bookings and ${deletedShows.deletedCount} shows.`
      );

      return {
        deletedBookings: deletedBookings.deletedCount,
        deletedShows: deletedShows.deletedCount,
      };
    });
  }
);


const sendbookingEmail = inngest.createFunction(
    { id: "send-booking-confirmation-mail" },
    { event: 'app/show.booked' },
    async ({ event }) => {
        const { bookingId } = event.data;

        try {
            const booking = await Booking.findById(bookingId).populate({
                path: 'show',
                populate: {
                    path: 'movie',
                    model: 'Movie'
                }
            }).populate('user');

            if (!booking || !booking.user || !booking.show || !booking.show.movie) {
                console.warn(`Booking or related data missing for booking ID ${bookingId}`);
                return;
            }

            const showTime = new Date(booking.show.showDateTime).toLocaleTimeString('en-US', {
                timeZone: 'Asia/Kolkata'
            });

            const showDate = new Date(booking.show.showDateTime).toLocaleDateString('en-US', {
                timeZone: 'Asia/Kolkata'
            });

            await sendEmail({
                to: booking.user.email,
                subject: `Payment confirmation: '${booking.show.movie.originalTitle}' booked!`,
                body: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <div style="background-color: #7b2cbf; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">🎟️ QuickShow Booking Confirmed!</h1>
          </div>

          <div style="padding: 24px; font-size: 16px; color: #333;">
            <h2 style="margin-top: 0;">Hi ${booking.user.name},</h2>
            <p>Your booking for <strong style="color: #7b2cbf;">"${booking.show.movie.originalTitle}"</strong> is confirmed.</p>

            <p>
              <strong>Date:</strong> ${showDate}<br>
              <strong>Time:</strong> ${showTime}
            </p>
            <p><strong>Booking ID:</strong> <span style="color: #7b2cbf;">${booking._id}</span></p>
            <p><strong>Seats:</strong> ${booking.bookedseats?.join(', ') || 'N/A'}</p>

            <p>🎬 Enjoy the show and don’t forget to grab your popcorn!</p>
          </div>
          <img src="${booking.show.movie.primaryImage}" alt="${booking.show.movie.originalTitle} Poster" style="width: 100%; max-height: 350px; object-fit: cover; border-radius: 4px; margin-top: 16px;" />

          <div style="background-color: #f5f5f5; color: #777; padding: 16px; text-align: center; font-size: 14px;">
            <p style="margin: 0;">Thanks for booking with us!<br>— The QuickShow Team</p>
            <p style="margin: 4px 0 0;">📍 Visit us: <a href="https://quickshow-ecru.vercel.app" style="color: #7b2cbf; text-decoration: none;">QuickShow</a></p>
          </div>
        </div>`
            });

        } catch (error) {
            console.error("Error in sendbookingEmail function:", error);
        }
    }
);

const sendNewMovieEmail = inngest.createFunction(
    { id: 'send-new-movie-notification' },
    { event: 'app/show.added' },
    async ({ event }) => {
        const { movieId } = event.data;
        const users = await User.find({});
        const movie = await Movie.findById(movieId);

        if(!movie) return "No movie found";

        for (const user of users) {
            const userEmail = user.email;
            const userName = user.name;

            const subject = `🎬 New Show Added: ${movie.originalTitle}`;
            const body = `<div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
            <div style="background-color: #7b2cbf; color: white; padding: 20px; text-align: center;">
                <h1 style="margin: 0;">Hi ${userName},</h1>
            </div>

            <div style="padding: 24px; color: #333;">
                <h2 style="margin-top: 0;">"${movie.originalTitle}" is Now Available on QuickShow!</h2>
                <p><strong>Release Date:</strong> ${movie.releaseDate}</p>
                <p><strong>Genre:</strong> ${movie.genres.map((genre) => genre).join(', ')}</p>
                <p>${movie.description}</p>

                <img src="${movie.primaryImage}" alt="${movie.originalTitle} Poster" style="width: 100%; max-height: 350px; object-fit: cover; border-radius: 4px; margin-top: 16px;" />

                <div style="margin-top: 20px; text-align: center;">
                <a href="https://quickshow-ecru.vercel.app/movies/${movieId}" style="background-color: #7b2cbf; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">🎟️ Book Your Tickets</a>
                </div>
            </div>

            <div style="background-color: #f5f5f5; color: #777; padding: 16px; text-align: center; font-size: 14px;">
                <p style="margin: 0;">Thanks for staying with QuickShow!<br>We bring the cinema to your fingertips.</p>
                <p style="margin: 4px 0 0;">📍 Visit us: <a href="https://quickshow-ecru.vercel.app" style="color: #7b2cbf; text-decoration: none;">QuickShow</a></p>
            </div>
            </div>`

            await sendEmail({
                to : userEmail,
                subject,
                body,
            })
        }
        return {message : 'Notification sent'}
    }
)


export const functions = [userCreated, userUpdated, userDeleted, releaseSeatsandDeletebooking, cleanupOldData, sendbookingEmail, sendNewMovieEmail];