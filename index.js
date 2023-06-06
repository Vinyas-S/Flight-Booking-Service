const express = require('express')
const amqplib = require('amqplib')


const {ServerConfig, Logger, Queue} =require('./config')
const apiRoutes = require('./routes')
const app =express();

const CRON = require('./utils/common/cron-jobs')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api',apiRoutes);
app.use('/bookingService/api',apiRoutes);
app.listen(ServerConfig.PORT,async ()=>{
    console.log(`server started on ${ServerConfig.PORT}`);
    Logger.info("Sucessfully started server ",{})
    CRON();
    await Queue.connectQueue();
    console.log("queue connected")
});