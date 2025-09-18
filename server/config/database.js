import mongoose from "mongoose";

const mongoConnect = async() => {
    try {
        mongoose.connection.on('connected', () => console.log("Connected to mongoDB atlas!"));  
        await mongoose.connect(`${process.env.MONGO_URI}`);
    } catch (error) {
        console.log(error.message);
    }
}

export default mongoConnect;