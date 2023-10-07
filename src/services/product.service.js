'use strict';

const { BadRequestError } = require('../core/error.response');
const { product, clothing, electronic, furniture } = require('../models/product.model');
const { insertInventory } = require('../models/repo/inventory.repo');
const { findAllDraftsForShop, publishProductByShop,
    findAllPublishedForShop, unPublishProductByShop,
    searchProductByUser, findAllProducts,
    updateProductById } = require('../models/repo/product.repo');
const { removeUndefineData, updateNestedObjectParse } = require("../utils");

class ProductFactory {
    static productRegistry = {}
    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef;
    }
    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegistry[type];
        if (!productClass) throw new BadRequestError('Invalid type: ' + type);
        return new productClass(payload).createProduct()
    }
    static async updateProduct(type, payload, productId) {
        const productClass = ProductFactory.productRegistry[type];
        if (!productClass) throw new BadRequestError('Invalid type: ' + type);
        return new productClass(payload).updateProduct(productId)
    }
    static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true }
        return await findAllDraftsForShop({ query, limit, skip })
    }
    static async findAllPublishedForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isPublished: true }
        return await findAllPublishedForShop({ query, limit, skip })
    }
    static async publishProductByShop({ product_shop, product_id }) {
        return await publishProductByShop({ product_shop, product_id });
    }
    static async unPublishProductByShop({ product_shop, product_id }) {
        return await unPublishProductByShop({ product_shop, product_id });
    }
    static async getListProductSearch({ key }) {
        return await searchProductByUser({ key });
    }
    static async findAllProducts({ limit = 50, sort = 'ctime', page = 1, filter = { isPublished: true } }) {
        return await findAllProducts({
            limit, sort, page, filter,
            select: ['product_name', 'product_price', 'product_thumb']
        })
    }
    static async findProduct({ product_id }) {
        return await findProduct({ product_id, unSelect: ['__v'] })
    }
}
class Product {
    constructor({ product_name, product_thumb, product_description,
        product_price, product_quantity, product_shop, product_type,
        product_attributes }) {
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_quantity = product_quantity;
        this.product_shop = product_shop;
        this.product_type = product_type;
        this.product_attributes = product_attributes;
    }
    async createProduct(product_id) {
        const newProduct = await product.create({
            ...this,
            _id: product_id
        });
        if (newProduct) {
            await insertInventory({
                productId: newProduct._id,
                shopId: this.product_shop, stock: this.product_quantity
            })
        }
        return newProduct;
    }
    async updateProduct(productId, bodyUpdate) {
        return await updateProductById({ productId, bodyUpdate, model: product })
    }
}
class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newClothing) throw new BadRequestError('Create new clothing error!')
        const newProduct = await super.createProduct(newClothing._id)
        if (!newProduct) throw new BadRequestError('Create new product error!')
        return newProduct
    }
    async updateProduct(product_id) {
        //remove attributes has null,undefined
        //check xem update o dau?
        const updateNest = updateNestedObjectParse(this)
        const objectParams = removeUndefineData(updateNest)
        if (objectParams.product_attributes) {
            await updateProductById({ product_id, objectParams, model: clothing })
        }
        const updatedProduct = await super.updateProduct(product_id, objectParams)
        return updatedProduct
    }
}
class Furniture extends Product {
    async createProduct() {
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newFurniture) throw new BadRequestError('Create new furniture error!')
        const newProduct = await super.createProduct(newFurniture._id)
        if (!newProduct) throw new BadRequestError('Create new product error!')
        return newProduct
    }
}
class Electronic extends Product {
    async createProduct() {
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newElectronic) throw new BadRequestError('Create new electronic error!')
        const newProduct = await super.createProduct(newElectronic._id)
        if (!newProduct) throw new BadRequestError('Create new product error!')
        return newProduct
    }
}

//registry
ProductFactory.registerProductType('Electronics', Electronic)
ProductFactory.registerProductType('Clothing', Clothing)
ProductFactory.registerProductType('Furniture', Furniture)

module.exports = ProductFactory