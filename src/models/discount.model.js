const { model, Schema } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Discount'
const COLLECTION_NAME = 'Discounts'

const discountSchema = new Schema({
    discount_name: { type: String, required: true },
    discount_description: { type: String, required: true },
    discount_type: { type: String, default: 'fixed_amount' },//theo số lượng hoặc theo percentage
    discount_value: { type: Number, required: true },
    discount_code: { type: String, required: true },//ma giam gia
    discount_start_date: { type: Date, required: true },// ngay bat dau
    discount_end_date: { type: Date, required: true },//ngay ket thuc
    discount_max_uses: { type: Number, required: true },//so luong discount dduwouoc ap dung
    discount_max_value: { type: Number, required: true },
    discount_uses_count: { type: Number, required: true },// so discount da su dung
    discount_users_used: { type: Array, default: [] },// nguoi da su dung
    discount_max_uses_per_user: { type: Number, required: true },// so luong toi da discount duoc mot user  su dung
    discount_min_order_value: { type: Number, required: true },
    discount_shopId: { type: Schema.Types.ObjectId, ref: 'Shop' },
    discount_is_active: { type: Boolean, required: true },
    discount_applies_to: { type: String, required: true, enum: ['all', 'specific'] },
    discount_product_ids: { type: Array, default: [] }//so san pham duoc ap dung
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

module.exports = model(DOCUMENT_NAME, discountSchema);