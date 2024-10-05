const express= require('express');
const app=require('./app');
const morgan= require('morgan');

app.use(morgan('tiny'));
app.use(express.json());
app.listen(3000,() => {
    console.log(`listening on port 3000...`);
   
   });

