import {Schema, model} from "mongoose"

const OrderSchema = new Schema({
    orderId : {type: String, required:true},
    createOn : {type:Date, default:new Date().getTime()},
    orderStatus : {type: [String], required:[]},
    service: {type:String, required : true},
    items : {type: [String], required:[]},
    amout: {type:Number, required : true},
    pickupDate : {type:Date, default:[]},
    deliveryDate : {type:Date, default:[]}
})

export const Order = model("Order",OrderSchema);
