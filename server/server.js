import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv/config';
import mongoConnect from './config/database.js';
import { clerkMiddleware } from '@clerk/express';
import { serve } from "inngest/express";
import { inngest, functions } from "./Inngest/index.js"
import showRouter from './Routes/showrouter.js';
import bookingRouter from './Routes/bookingrouter.js';
import adminRouter from './Routes/adminrouter.js';
import userRouter from './Routes/userrouter.js';
import { stripeWebhooks } from './Control/Stripewebhooks.js';

const app = express();
const port = 3000;
await mongoConnect();

app.post('/api/stripe', express.raw({type : "application/json"}), stripeWebhooks);

//Middleware 
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware())

//Routes
app.get('/', (req,res) => {res.send('Server is live!')});
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/show", showRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/admin", adminRouter);
app.use('/api/user', userRouter);

// Listen at port : 3000
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
})

export default app;