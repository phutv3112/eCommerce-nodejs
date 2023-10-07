'use strict';

const { Schema, model } = require("mongoose");
const { default: slugify } = require("slugify");

const DOCUMENT_NAME = 'product'
const COLLECTION_NAME = 'products'

const productSchema = new Schema({
    product_name: {
        type: String,
        required: true,
    },
    product_thumb: {
        type: String,
        required: true,
    },
    product_description: String,
    product_slug: String,
    product_price: {
        type: Number,
        required: true,
    },
    product_quantity: {
        type: Number,
        required: true,
    },
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'shop'
    },
    product_type: {
        type: String,
        required: true,
        enum: ['Electronics', 'Clothing', 'Furniture']
    },
    product_attributes: {
        type: Schema.Types.Mixed,
        required: true
    },
    product_rating: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be higher than 1'],
        max: [5, 'Rating must be lower than 5'],
        set: (val) => Math.round(val * 10) / 10
    },
    product_variations: { type: Array, default: [] },
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false },

}, {
    timestamps: true,
    collection: COLLECTION_NAME
});
//create index for search
productSchema.index({ product_name: 'text', product_description: 'text' })
// Document middleware
productSchema.pre('save', function (next) {
    this.product_slug = slugify(this.product_name, { lower: true })
    next()
})

const clothingSchema = new Schema({
    brand: { type: String, required: true },
    size: String,
    material: String,
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'shop'
    },
}, {
    timestamps: true,
    collection: 'clothes'
})
const furnitureSchema = new Schema({
    brand: { type: String, required: true },
    size: String,
    material: String,
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'shop'
    },
}, {
    timestamps: true,
    collection: 'furniture'
})
const electronicSchema = new Schema({
    manufacturer: { type: String, required: true },
    model: String,
    color: String,
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'shop'
    },
}, {
    timestamps: true,
    collection: 'electronics'
})
module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    clothing: model('Clothing', clothingSchema),
    electronic: model("Electronics", electronicSchema),
    furniture: model("Furniture", furnitureSchema),
}