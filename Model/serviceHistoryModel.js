import mongoose, { Schema } from "mongoose";

const serviceHistory = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    Date: {
        type: Date,
        default: Date.now,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    staff: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Staff",
        required: true,
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "completed", "cancelled"],
        default: "pending",
    },
    feedback: {
        type: String,
        default: "",
    },
});

export default mongoose.model("ServiceHistory", serviceHistory);
