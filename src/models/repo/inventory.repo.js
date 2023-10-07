const { convertToObjectIdMongoDB } = require("../../utils")
const inventoryModel = require("../inventory.model")


const insertInventory = async ({
    productId, shopId, stock, location = 'unKnow'
}) => {
    return await inventoryModel.create({
        inven_productId: productId,
        inven_stock: stock,
        inven_location: location,
        inven_shopId: shopId
    })
}
const reservationInventory = async ({ productId, quantity, cartId }) => {
    const query = {
        inven_productId: convertToObjectIdMongoDB(productId),
        inven_stock: { $gte: quantity }
    }, updateSet = {
        $inc: {
            inven_stock: -quantity
        },
        $push: {
            inven_reservation: {
                quantity,
                cartId,
                createOn: new Date()
            }
        }
    }, options = { upsert: true, new: true }
    return await inventoryModel.updateOne(query, updateSet, options);
}

module.exports = {
    insertInventory,
    reservationInventory,
}