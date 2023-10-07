const { convertToObjectIdMongoDB } = require('../../utils/')
const cartModel = require('../cart.model')

const findCartById = async (cartId) => {
    return await cartModel.findOne({ _id: convertToObjectIdMongoDB(cartId), cart_state: 'active' })
}

module.exports = {
    findCartById
}