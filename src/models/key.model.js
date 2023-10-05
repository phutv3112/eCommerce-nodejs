'use strict';

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = 'key'
const COLLECTION_NAME = 'keys'

const keySchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'shop'
    },
    publicKey: {
        type: String,
        require: true,
    },
    privateKey: {
        type: String,
        require: true,
    },
    refreshTokensUsed: {
        type: Array,
        default: []
    },
    refreshToken: {
        type: String,
        required: true
    },

}, {
    timestamps: true,
    collection: COLLECTION_NAME
});
module.exports = model(DOCUMENT_NAME, keySchema)