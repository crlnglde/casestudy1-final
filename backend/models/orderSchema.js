const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        required: true,
        unique: true,
        default: function() {
            // Generate a unique order number, for example, using a timestamp
            return 'CAN' + Date.now().toString(36).toUpperCase();
        }
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['regular load', 'heavy load'],
        required: true
    },
    kilo: {
        type: Number,
        required: true
    },
    service: {
        type: String,
        enum: ['Wash and Dry', 'Wash Only', 'Dry Only'],
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String
    },
    status: {
        type: String,
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const OrderModel = mongoose.model('orders', OrderSchema);

module.exports = OrderModel;
