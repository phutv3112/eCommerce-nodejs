const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'inventory'
const COLLECTION_NAME = 'inventories'

const inventorySchema = new Schema({
    inven_productId: { type: Schema.Types.ObjectId, ref: 'product' },
    inven_location: { type: String, default: 'unKnow' },
    inven_stock: { type: Number, require: true },
    inven_shopId: { type: Schema.Types.ObjectId, ref: 'shop' },
    inven_reservations: { type: Array, default: [] }

}, {
    collection: COLLECTION_NAME,
    timestamps: true
});


module.exports = model(DOCUMENT_NAME, inventorySchema);