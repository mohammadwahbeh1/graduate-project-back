// app.js
const express = require('express');
const app = express();
const userRouter = require('./routes/userRouter');
const terminalRouter = require('./routes/terminalRouter');
const lineRouter= require('./routes/lineRouter');
const reservationRouter=require('./routes/reservationRouter');

const vehicleRouter= require('./routes/vehicleRouter');
const reviewsRouter= require('./routes/ReviewsRouter');
const loginRouter= require('./routes/loginRouter');
const registerRouter= require('./routes/signUpRouter');
const adminRouter = require('./routes/adminRouter'); 
const notificationsRouter=require('./routes/notificationsRouter');
const driverRatingsRouter=require('./routes/driverRatingsRouter');
const messagesRouter=require('./routes/messagesRouter');
const driverQueRoutes = require('./routes/driverQueRoutes');

const cors = require('cors');
const {join} = require("node:path");

app.use('/uploads', express.static(join(__dirname, 'uploads')));

app.use(express.json());
app.use(cors());


app.use('/api/v1/messages', messagesRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/terminals', terminalRouter);
app.use('/api/v1/line', lineRouter);
app.use('/api/v1/reservation', reservationRouter);

app.use('/api/v1/vehicle', vehicleRouter); 

app.use('/api/v1/reviews', reviewsRouter);
app.use('/api/v1/register', registerRouter);
app.use('/api/v1/login', loginRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/notifications', notificationsRouter);
app.use('/api/v1/driver-ratings', driverRatingsRouter);
app.use('/api/driversQue', driverQueRoutes);







module.exports = app;
