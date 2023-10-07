'use strict';

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = 'order'
const COLLECTION_NAME = 'orders'

const orderSchema = new Schema({
    order_userId: {
        type: Number,
        required: true,
    },
    order_checkout: {
        type: Object,
        default: {},
    },
    order_payment: {
        type: Object,
        default: {},
    },
    order_products: {
        type: Array,
        required: true
    },
    order_shipping: {
        type: String,
        required: true
    },
    order_trackingNumber: {
        type: String,
        default: '#13241313243'
    },
    order_status: {
        type: String,
        enum: ['pending', 'confirmed', 'shipped', 'cancelled', 'delivered'],
        default: 'pending',
    },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});
module.exports = model(DOCUMENT_NAME, orderSchema)