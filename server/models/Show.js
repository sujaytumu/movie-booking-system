import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const showSchema = new Schema({
    movie: { type: String, required: true, ref: "Movie" },
    showDateTime: { type: Date, required: true },
    showprice: { type: Number, required: true },
    occupiedSeats: { type: Object, default: {} }
}, { minimize: false });

export default mongoose.model('Show', showSchema);