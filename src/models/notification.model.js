const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'notification'
const COLLECTION_NAME = 'notifications'

const notificationSchema = new Schema({
    noti_type: {
        type: String,
        enum: ['ORDER-001', 'ORDER-002', 'PROMOTION-001', 'SHOP-001'],
        required: true
    },
    noti_senderId: { type: Schema.Types.ObjectId, required: true, ref: "shop" },
    noti_receivedId: { type: Number, required: true },
    noti_content: { type: String, default: 0 },
    noti_options: {
        type: Object,
        default: {}
    },
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})


module.exports = model(DOCUMENT_NAME, notificationSchema);