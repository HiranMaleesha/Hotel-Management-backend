//s578DICDk02uJ70c

const express = require("express");
const mongoose = require("mongoose");
const router = require("./Routes/UserRoutes");



const app = express();
const cors = require("cors");

//middleware
app.use(express.json());
app.use(cors());
app.use("/users",router);


mongoose.connect("mongodb+srv://maleesha20010527:s578DICDk02uJ70c@cluster0.lzmk3.mongodb.net/")
.then(()=> console.log("Connected to MongoDB"))
.then(() => {
    app.listen(4000);
})
.catch((err) => console.log((err)));