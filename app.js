// app.js

const express = require('express');
const app = express();
const userRouter = require('./routes/userRouter');
const terminalRouter = require('./routes/terminalRouter'); // استيراد مسار التيرمنل

app.use('/api/v1/users', userRouter);
app.use('/api/v1/terminals', terminalRouter); // استخدام مسار التيرمنل

module.exports = app;
