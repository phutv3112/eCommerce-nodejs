const { NotFoundError } = require("../core/error.response")
const cartModel = require("../models/cart.model")
const productModel = require("../models/product.model")
const { product } = require('../models/product.model')
const { convertToObjectIdMongoDB } = require("../utils")


class CartService {
    static async createUserCart({ userId, product }) {
        const query = { cart_userId: userId, cart_state: 'active' },
            updateOrInsert = {
                $addToSet: {
                    cart_products: product
                }
            }, option = { upsert: true, new: true }

        return await cartModel.findOneAndUpdate(query, updateOrInsert, option)
    }

    static async updateUserCartQuantity({ userId, product }) {
        const { productId, quantity } = product
        const query = {
            cart_userId: userId,
            'cart_products.productId': productId,
            cart_state: 'active'
        }, updateSet = {
            $inc: { 'cart_products.$.quantity': quantity }
        }, option = { upsert: true, new: true }
        return await cartModel.findOneAndUpdate(query, updateSet, option)
    }

    static async addToCart({ userId, product = {} }) {
        const userCart = await cartModel.findOne({ cart_userId: userId })
        if (!userCart) {
            //create cart for user
            return await CartService.createUserCart({ userId, product })
        }
        //neu co gio hang roi nhung chua co san pham
        if (!userCart.cart_products.length) {
            userCart.cart_products = [product]
            return await userCart.save()
        }
        //gio hàng ton tai va co san pham thi update quantity
        return await CartService.updateUserCartQuantity({ userId, product })
    }

    static async addToCartV2({ userId, shop_order_ids }) {
        const { productId, quantity, old_quantity } = shop_order_ids[0]?.item_products[0]
        //check product
        const foundProduct = await product.findOne(({ _id: convertToObjectIdMongoDB(productId) }))
        if (!foundProduct) throw new NotFoundError()
        //compare
        if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
            throw new NotFoundError('Product do not belong to the shop')
        }
        if (quantity === 0) {

        }

        return await CartService.updateUserCartQuantity({
            userId,
            product: {
                productId,
                quantity: quantity - old_quantity
            }
        })
    }

    static async deleteUserCartItem({ userId, productId }) {
        const query = { cart_userId: userId, cart_state: 'active' },
            updateSet = {
                $pull: {
                    cart_products: {
                        productId
                    }
                }
            }
        const deleteCart = await cartModel.updateOne(query, updateSet)
        return deleteCart
    }

    static async getListUserCart({ userId }) {
        return await cartModel.findOne({
            cart_userId: +userId
        })
    }
}

module.exports = CartService