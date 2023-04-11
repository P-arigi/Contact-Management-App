const express = require("express");
const connectDB = require("./config/dbConnection");
const errorHandler = require("./middleware/errorHandler");
const dotenv = require("dotenv").config();

const contactRouter = require("./routes/contactRoutes")
const userRouter = require("./routes/userRoutes")


connectDB();
const app = express();
app.use(express.json())
app.use("/api/contacts",contactRouter)
app.use("/api/users",userRouter)
app.use(errorHandler)

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})