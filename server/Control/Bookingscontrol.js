import { inngest } from "../Inngest/index.js";
import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import { Stripe } from 'stripe';

// To check the availability of selected seats
export const checkavailabilty = async (showId, selectedSeats) => {
    try {
        const show = await Show.findById(showId);
        if (!show) {
            return false;
        }
        const occupiedSeats = show.occupiedSeats;
        const isSeatTaken = selectedSeats.some((seat) => { occupiedSeats[seat] });

        return !isSeatTaken;
    } catch (error) {
        console.log(error);
        return false;
    }
}

// Create a booking for a specific show
export const createBooking = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { showId, selectedSeats } = req.body;
        const origin = req.headers.origin;

        const isAvailable = await checkavailabilty(showId, selectedSeats);
        if (!isAvailable) {
            return res.json({ success: false, message: "Selected seats are not available" });
        }
        const show = await Show.findById(showId).populate('movie');
        const booking = await Booking.create({
            user: userId,
            show: showId,
            amount: show.showprice * selectedSeats.length,
            bookedseats: selectedSeats
        })
        selectedSeats.forEach((seat) => {
            return show.occupiedSeats[seat] = true;
        })
        show.markModified('occupiedSeats');
        await show.save();

        // Stripe gateway
        const stripeInstance = new Stripe(`${process.env.STRIPE_SECRET_KEY}`);
        const conversionRate = 86;
        const inrAmount = booking.amount;
        const usdAmount = inrAmount / conversionRate;
        const unitAmountInCents = Math.floor(usdAmount * 100);

        const line_items = [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: show.movie.originalTitle,
                    },
                    unit_amount: unitAmountInCents,
                },
                quantity: 1,
            }
        ]

        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/loading/my-bookings`,
            cancel_url: `${origin}/my-bookings`,
            line_items: line_items,
            mode: 'payment',
            metadata: {
                bookingId: booking._id.toString(),
            },
        })
        booking.paymentLink = session.url;
        await booking.save();

        await inngest.send({
            name: "app/checkpayment",
            data: {
                bookingId: booking._id.toString(),
            }
        })

        res.json({ success: true, url: session.url });
    } catch (error) {
        console.error("Stripe session error:", error);
        res.json({ success: false, message: error.message });
    }
}

export const getoccupiedSeats = async (req, res) => {
    try {
        const { showId } = req.params;
        const showdata = await Show.findById(showId);
        const occupiedSeats = Object.keys(showdata.occupiedSeats);

        res.json({ success: true, occupiedSeats });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}