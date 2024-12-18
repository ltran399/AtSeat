import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";

import adminRoute from "./routes/admin.js";
import userRoute from "./routes/users.js";
import restRoute from "./routes/rests.js";
import reservRoute from "./routes/reservation.js";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 7700;

const connect = async()=>{
    try{
        await mongoose.connect(process.env.MONGO);
        console.log("Connected to MongoDB");
    } catch (error){
        throw error;
    }
}

mongoose.connection.on("disconnected", () => {
    console.log("mongoDB disconnected!")
});

app.get('/',(req,res) => { res.send('Hello from Express!') });

app.use(cookieParser());
app.use(express.json());
app.use(helmet());

app.use(cors({
    origin:"http://localhost:3000",
    credentials: true
}));

app.use(morgan("common"));

app.use("/api/admin", adminRoute);
app.use("/api/user", userRoute);
app.use("/api/restaurants", restRoute);
app.use("/api/reservations", reservRoute);
app.use((err, req, res, next) => {
    console.error("Error:", err);
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: process.env.NODE_ENV === "development" ? err.stack : {}
    });
});
app.listen(PORT, ()=>{
    console.log("Listening on port 7700");
    connect();
})
