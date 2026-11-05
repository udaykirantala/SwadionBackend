import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "./routes/SwadionCategory.routes.js"
import Countries from "./routes/SwadionCountries.routes.js"
import Recipes from "./routes/SwadionRecipes.routes.js"
import cors from "cors";
dotenv.config();

const app = express();

const port = process.env.PORT || 9502;
const mongourl = process.env.MONGO_URI

mongoose.set("strictQuery", false);

const allowedOrigins = [
    "http://localhost:5173",
    "https://0ba79822.swadion.pages.dev",
    "https://swadion.com",
    "https://www.swadion.com"
];


app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json())


app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Swadion backend is running"
    });
});


//Middelwares
app.use("/app/swadion/category", Category);
app.use("/app/swadion/countries", Countries);
app.use("/app/swadion/recipes", Recipes);


const connectDB = async () => {
    try {
        await mongoose.connect(mongourl)
        console.log(`Swadion Data Base is Connected....!`);

    } catch (error) {
        console.log("Database connection error:", error);
    }
}

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Swadion Server is Running in Port ${port}`);
    })
})

