const {StatusCodes} = require('http-status-codes');

const {Booking} = require('../models');
const CrudRepository= require('./crud-repository');
const {Op} = require('sequelize');


const {Enums} = require('../utils/common');

const {BOOKED ,CANCELLED} =Enums.BOOKING_STATUS
class BookingRepository extends CrudRepository{
    constructor(){
        super(Booking);
    }

    async createBooking(data, transaction) {
        const response = await Booking.create(data, {transaction: transaction});
        return response;
    } 

    async get(data,transaction) {
        const response = await Booking.findByPk(data,{transaction: transaction});
        if(!response){
            throw new AppError('Not able to find the resource',StatusCodes.NOT_FOUND);
        }
        console.log(response)
        return response;
      }

      async update(id, data, transaction) {
   
        const response = await Booking.update(data, {
          where: {
            id: id,
          },
        },{transaction: transaction});
        if(!response[0]){
            throw new AppError('Not able to find the resource',StatusCodes.NOT_FOUND);
        }
        return response;
      }

      async cancelOldBookings(timestamp){
        const response = await Booking.update({status:CANCELLED},{
            where:{
                [Op.and]:[
                    {
                        createdAt:{
                            [Op.lt]: timestamp
                        }
                    },
                    {
                        status:{
                            [Op.not] : BOOKED  
                        }
                    },
                    {
                        status:{
                            [Op.ne]: CANCELLED
                        }
                    }
                ]
                
            }
        })
        return response; 
      }
}

module.exports = BookingRepository;