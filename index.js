import express from "express";
import cors from "cors";

import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./Model/userModel.js";
import History from "./Model/serviceHistoryModel.js";
import Staff from "./Model/staffModel.js";
import serviceModel from "./Model/serviceModel.js";

const app = express();

app.use(cors());
app.use(express.json());
dotenv.config();

mongoose
    .connect(process.env.MONGO_URL)
    .then((result) => {
        console.log("connected to Mongodb");
    })
    .catch((err) => {
        console.error(err);
    });

app.get("/", (req, res) => {
    res.send("Hello to Selon management system");
});

app.post("/user/signup", async (req, res) => {
    const { name, email, password, phone } = req.body;
    // Create a new user
    const newUser = new User({
        name,
        email,
        password,
        phone,
        appointments: [],
        upcomingAppointments: 0,
    });

    // Save the user to the database
    await newUser.save();

    res.json({
        message: "User created successfully",
        user: newUser,
    });
});

//  Login route for user

app.post("/user/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (!user) {
        return res.json({
            message: "Invalid email or password",
        });
    }

    res.json({
        message: "Login successful",
        user,
    });
});

//  Create an appointment route

app.post("/user/appointment", async (req, res) => {
    const {
        email,
        date,
        staffId,
        sName,
        startTime,
        endTime,
        price,
        description,
    } = req.body;

    if (!email || !date || !staffId || !sName || !startTime || !endTime) {
        return res.json({
            message: "All fields are required",
        });
    }

    const user = await User.findOne({ email });

    if (!user) {
        return res.json({
            message: "User not found",
        });
    }
    const newAppointment = new History({
        name: sName,
        Date: date,
        price,
        description,
        startTime,
        endTime,
        description,
        staff: staffId,
        customer: user._id,
    });

    await newAppointment.save();

    user.appointments.push(newAppointment._id);

    await user.save();

    res.json({
        message: "Appointment created successfully",
        appointment: newAppointment,
    });
});

// Cancel an appointment route

app.put("/user/appointment/cancel", async (req, res) => {
    const { email, appointmentId } = req.body;

    console.log("email", email);

    console.log("appointmentId", appointmentId);
    const user = await User.findOne({ email });

    if (!user) {
        return res.json({
            message: "User not found",
        });
    }

    // dont delete the appointment from the database

    const his = await History.findById(
        new mongoose.Types.ObjectId(appointmentId)
    );

    if (!his) {
        return res.json({
            message: "Appointment not found",
        });
    }

    his.status = "cancelled";

    await his.save();

    res.json({
        message: "Appointment cancelled successfully",
        appointment: his,
    });
});

//  update an appointment route

app.put("/user/appointment/update", async (req, res) => {
    const { email, appointmentId, date, startTime, endTime } = req.body;

    const user = await User.findById(email);

    if (!user) {
        return res.json({
            message: "User not found",
        });
    }

    const History = await History.findOne(
        mongoose.Types.ObjectId(appointmentId)
    );

    if (!History) {
        return res.json({
            message: "Appointment not found",
        });
    }

    History.date = date;
    History.startTime = startTime;
    History.endTime = endTime;
    await History.save();

    res.json({
        message: "Appointment updated successfully",
        appointment: History,
    });
});

// get user/services-staff

app.get("/user/services-staff", async (req, res) => {
    const { email } = req.headers;

    const user = await User.findOne({
        email,
    });

    if (!user) {
        return res.json({
            message: "User not found",
        });
    }

    const staffs = await Staff.find();

    const services = await serviceModel.find();

    res.json({
        staffs,
        services,
    });
});

//  Get all appointments  for a user

app.get("/user/appointments", async (req, res) => {
    const { email } = req.headers;

    const user = await User.findOne({
        email,
    }).populate("appointments");

    if (!user) {
        return res.json({
            message: "User not found",
        });
    }

    res.json({
        appointments: user.appointments,
    });
});

// Admin routes

//  Create a route

app.post("/admin/staff", async (req, res) => {
    const { name, email } = req.body;

    const newStaff = new Staff({
        name,
        email,
        appointments: [],
        notAvailable: [],
    });

    await newStaff.save();

    res.json({
        message: "Staff created successfully",
        staff: newStaff,
    });
});

// Get all staffs

app.get("/admin/staffs", async (req, res) => {
    const staffs = await Staff.find();

    res.json({
        staffs,
    });
});

//  delete a staff route

app.post("/admin/delete-staff", async (req, res) => {
    const { id } = req.body;

    //  delete the staff from the database

    await Staff.findByIdAndDelete(new mongoose.Types.ObjectId(id));

    res.json({
        message: "Staff deleted successfully",
    });
});

// Update a staff route

app.put("/admin/staff/update", async (req, res) => {
    const { email, name, services } = req.body;

    const staff = await Staff.findOne({
        email,
    });

    if (!staff) {
        return res.json({
            message: "Staff not found",
        });
    }

    staff.name = name;
    staff.services = [...services];

    await staff.save();

    res.json({
        message: "Staff updated successfully",
        staff,
    });
});

//  Get all appointments for a staff

app.get("/admin/staff/appointments", async (req, res) => {
    const { email } = req.headers;

    const staff = await Staff.findOne({
        email,
    }).populate("appointments");

    if (!staff) {
        return res.json({
            message: "Staff not found",
        });
    }

    res.json({
        appointments: staff.appointments,
    });
});

//  get all appointments

app.get("/admin/appointments", async (req, res) => {
    const appointments = await History.find();

    res.json({
        appointments,
    });
});

//  add services

app.post("/admin/services", async (req, res) => {
    const { name, price, duration, description } = req.body;

    const newService = new serviceModel({
        name,
        price,
        duration,
        description,
    });

    await newService.save();

    res.json({
        message: "Service created successfully",
        service: newService,
    });
});

// get all services

app.get("/admin/services", async (req, res) => {
    const services = await serviceModel.find();

    res.json({
        services,
    });
});

//  delete a service route

app.post("/admin/delete-service", async (req, res) => {
    const { id } = req.body;

    //  delete the service from the database

    await serviceModel.findByIdAndDelete(new mongoose.Types.ObjectId(id));

    res.json({
        message: "Service deleted successfully",
    });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
