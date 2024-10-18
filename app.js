// app.js

const express = require('express');
const app = express();
const userRouter = require('./routes/userRouter');
const terminalRouter = require('./routes/terminalRouter');
const lineRouter= require('./routes/lineRouter');
const reservationRouter=require('./routes/reservationRouter');
const TemporaryVoiceMessageRouter= require('./routes/temporaryVoiceMessageRouter');
const vehicleRouter= require('./routes/vehicleRouter');
const reviewsRouter= require('./routes/ReviewsRouter');
const loginRouter= require('./routes/loginRouter');
const registerRouter= require('./routes/signUpRouter');
const adminRouter = require('./routes/adminRouter'); 


app.use(express.json());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/terminals', terminalRouter);
app.use('/api/v1/line', lineRouter);
app.use('/api/v1/reservation', reservationRouter);
app.use('/api/v1/voiceMessage', TemporaryVoiceMessageRouter);
app.use('/api/v1/vehicle', vehicleRouter); 
app.use('/api/v1/reviews', reviewsRouter);
app.use('/api/v1/register', registerRouter);
app.use('/api/v1/login', loginRouter);
app.use('/api/v1/admin', adminRouter);



module.exports = app;
