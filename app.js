const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors=require('cors')
require('dotenv').config()

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO = process.env.MONGO_URL

// Middleware

app.use(bodyParser.json());
app.use(cors())

// MongoDB Connection
mongoose.connect(MONGO)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Routes
const userRoutes = require('./routes/users');
const locationRoutes = require('./routes/locations');
const authRoutes=require('./routes/auth')

app.use('/users', userRoutes);
app.use('/auth',authRoutes)
app.use('/locations', locationRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
