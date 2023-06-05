const express = require('express')

const {ServerConfig, Logger} =require('./config')
const apiRoutes = require('./routes')
const app =express();

const CRON = require('./utils/common/cron-jobs')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api',apiRoutes);
app.use('/bookingService/api',apiRoutes);
app.listen(ServerConfig.PORT,()=>{
    console.log(`server started on ${ServerConfig.PORT}`);
    Logger.info("Sucessfully started server ",{})
    CRON();
});