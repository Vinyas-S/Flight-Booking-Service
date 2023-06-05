const {BookingService}= require('../services')

const {StatusCodes}= require("http-status-codes")
const {SuccessResponse , ErrorResponse} = require('../utils/common')

const inMemDb = {};
async function createBooking(req, res) {
    try {
        console.log("req.body",req.body)
        const response = await BookingService.createBooking({
            flightId: req.body.flightId,
            noOfSeats: req.body.noOfSeats,
            userId: req.body.userId,
        });
        SuccessResponse.data = response;
        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse);
    } catch(error) {
        ErrorResponse.error = error;
        return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json(ErrorResponse);
    }
}

async function makePayment(req, res) {
    const idempotencyKey = req.headers['x-idempotency-key'];
    if(!idempotencyKey){
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json({
                    message: 'idempotency key missing'
                });
    }
    if(inMemDb[idempotencyKey]){
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json({
                    message: 'Cannot retry on a succesful payment'
                });
    }
    try {
        console.log("req.body",req.body)
        const response = await BookingService.makePayment({
            userId: req.body.userId,
            totalCost :req.body.totalCost,
            bookingId : req.body.bookingId
        });
        inMemDb[idempotencyKey] = idempotencyKey;
        SuccessResponse.data = response;
        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse);
    } catch(error) {
        ErrorResponse.error = error;
        return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json(ErrorResponse);
    }
}
module.exports = {
    createBooking,
    makePayment,
}