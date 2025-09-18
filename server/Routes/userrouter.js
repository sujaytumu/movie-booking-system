import express from "express";
import { getfavorites, getUserbookings, updateUserfavorites } from "../Control/Usercontrol.js";
const userRouter = express.Router();

userRouter.get('/userbookings', getUserbookings);
userRouter.post('/updatefavorites', updateUserfavorites);
userRouter.get('/getfavorites', getfavorites);

export default userRouter;