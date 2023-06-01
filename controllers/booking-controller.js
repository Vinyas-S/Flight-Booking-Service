const {BookingService}= require('../services')

const {StatusCodes}= require("http-status-codes")
const {SuccessResponse , ErrorResponse} = require('../utils/common')

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
module.exports = {
    createBooking
}