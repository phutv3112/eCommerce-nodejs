'use strict'
const DiscountService = require('./discount.service')
const { BadRequestError } = require("../core/error.response")
const { findCartById } = require("../models/repo/cart.repo")
const { checkProductByServer } = require("../models/repo/product.repo")
const { acquireLock, releaseLock } = require('./redis.service')

class CheckoutService {
    static async checkoutReview({
        cardId, userId, shop_order_ids
    }) {
        const foundCart = await findCartById(cardId)
        if (!foundCart) throw new BadRequestError('Cart not exist')

        const checkout_order = {
            totalPrice: 0,
            feeShip: 0,
            totalDiscount: 0,
            totalCheckout: 0
        }, shop_order_ids_new = []
        // tính tổng tiền bill
        for (let i = 0; i < shop_order_ids.length; i++) {
            const { shopId, shop_discount = [], item_product } = shop_order_ids[i];
            //kiem tra available
            const checkProductServer = await checkProductByServer(item_product)
            console.log(`checkProductByServer:::::`, checkProductServer)
            if (!checkProductServer[0]) throw new BadRequestError('Order wrong!!!')
            //tong tien don hang
            const checkoutPrice = await checkProductServer.reduce((acc, product) => {
                return acc = (product.quantity * product.price)
            }, 0)
            //tong tien truoc khi xu ly
            checkout_order.totalPrice += checkoutPrice

            const itemCheckout = {
                shopId,
                shop_discount,
                priceRaw: checkoutPrice, // tien truoc khi giam gia
                priceApplyDiscount: checkoutPrice,
                item_products: checkProductServer
            }

            //neu shop_discount ton tai > 0, check xem co hop le hay khong
            if (shop_discount.length > 0) {
                //gia su có mot discount
                //get amount discount
                const { totalPrice = 0, discount = 0 } = await DiscountService.getDiscountAmount({
                    codeId: shop_discount[0].codeId,
                    userId,
                    shopId,
                    products: checkProductServer
                })
                //tong cong discount giảm giá
                checkout_order.totalDiscount += discount
                //neu tien giam gia > 0
                if (discount > 0) {
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount
                }
            }
            //tong thanh toan cuoi cung
            checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
            shop_order_ids_new.push(itemCheckout)
        }
        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order
        }
    }

    static async orderByUser({
        shop_order_id_new,
        cartId,
        userId,
        user_address = {},
        user_payment = {}
    }) {
        const { shop_order_ids_new, checkout_order } = await CheckoutService.checkoutReview({
            cartId,
            userId,
            shop_order_id_new
        })
        //check lại xem co vượt tồn kho hay không
        //get new array products
        const products = shop_order_ids_new.flatMap(order => order.item_products)
        console.log(`[1]::::::::`, products)
        const acquireProduct = [];
        for (let i = 0; i < products.length; i++) {
            const { productId, quantity } = products[i]
            const keyLock = await acquireLock(productId, quantity, cartId)
            acquireProduct.push(keyLock ? true : false)
            if (keyLock) {
                await releaseLock(keyLock)
            }
        }

        if (acquireProduct.indexOf(false)) throw new BadRequestError('some products have just been updated')
        const newOrder = await orderModel.create({
            order_userId: userId,
            order_checkout: checkout_order,
            order_shipping: user_address,
            order_payment: user_payment,
            order_products: shop_order_ids_new
        })
        if (newOrder) {

        }
        return newOrder
    }
    static async getOrdersByUser() { }
    static async getOneOrderByUser() { }
    static async cancelOrderByUser() { }
}

module.exports = CheckoutService