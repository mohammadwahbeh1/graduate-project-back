const express = require('express');
const app = express();
const userRouter = require('./routes/userRouter');


app.use('/api/v1/users',userRouter);




module.exports=app;