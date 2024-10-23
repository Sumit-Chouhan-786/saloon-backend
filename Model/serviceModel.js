import mongoose from "mongoose";

const serviceOfferd = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
});

export default mongoose.model("ServiceOfferd", serviceOfferd);
