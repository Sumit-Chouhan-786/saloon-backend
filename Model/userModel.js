import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    appointments: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "ServiceHistory",
        default: [],
    },
    upcomingAppointments: {
        type: Number,
        default: 0,
    },
});

export default mongoose.model("User", userSchema);
