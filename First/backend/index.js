// importing express
const express = require('express');
// install mongoose
const mongoose = require('mongoose');
const cors = require('cors');

// import dotenv
require("dotenv").config()

// create the server
const server = express()

server.use(cors())

// PORT NUMBER
const PORT = process.env.PORT

// MongoDB
const MONGO_URL = process.env.MONGO_URL

//Middleware
server.use(express.json())

// import the routes
const userRoutes = require("./Routes/usersRoutes")
const authRoutes = require("./Routes/authRoutes")

// register route
server.use(userRoutes)
server.use(authRoutes)

mongoose.connect(MONGO_URL)
  .then(() => {
    console.log("MongoDB connected Successfully")
    server.listen(PORT, () => {
      console.log("Server started on port " + PORT)
    })
  })
  .catch((err) => {
    console.error("MongoDB connection failed", err.message)
  })

