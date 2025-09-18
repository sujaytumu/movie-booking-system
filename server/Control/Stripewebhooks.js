import Stripe from "stripe";
import Booking from "../models/Booking.js";
import { inngest } from "../Inngest/index.js";

export const stripeWebhooks = async (request, response) => {
    const stripeInstance = new Stripe(`${process.env.STRIPE_SECRET_KEY}`);
    const sig = request.headers["stripe-signature"];

    let event;
    try {
        event = stripeInstance.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_KEY);
    } catch (error) {
        return response.status(400).send(`Webhook error : ${error.message}`);
    }

    try {
        switch (event.type) {
            case "payment_intent.succeeded": {
                const paymentIntent = event.data.object;
                const sessionList = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntent.id,
                })
                const session = sessionList.data[0];
                const { bookingId } = session.metadata;
                await Booking.findByIdAndUpdate(bookingId, {
                    isPaid: true,
                    paymentLink: '',
                })

                // send a email through nodemailer
                await inngest.send({
                    name : 'app/show.booked',
                    data : {bookingId},
                })
                break;
            }

            default:
                console.log('Unhandled event type :', event.type)
                break;
        }
        response.json({ received: true });
    } catch (error) {
        console.log('Webhook processing error:', error);
        response.status(500).send("Internal Server Error");
    }
}