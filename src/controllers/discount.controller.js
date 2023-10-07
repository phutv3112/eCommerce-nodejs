const { CreateRequest, SuccessResponse } = require("../core/success.response")
const DiscountService = require("../services/discount.service")


class DiscountController {
    static createDiscountCode = async (req, res) => {
        new CreateRequest({
            message: 'Create discount code success',
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                shopId: req.user.userId
            })
        }).send(res)
    }

    static getAllDiscountCodesByShop = async (req, res) => {
        new SuccessResponse({
            message: 'Get discount code success',
            metadata: await DiscountService.getAllDiscountCodesByShop({
                ...req.query,
                shopId: req.user.userId
            })
        }).send(res)
    }

    static getAllDiscountCodesWithProducts = async (req, res) => {
        new SuccessResponse({
            message: 'Get discount code success',
            metadata: await DiscountService.getAllDiscountCodesWithProduct({
                ...req.query,
            })
        }).send(res)
    }

    static getDiscountAmount = async (req, res) => {
        new SuccessResponse({
            message: 'Get discount amount success',
            metadata: await DiscountService.getDiscountAmount({
                ...req.body,
            })
        }).send(res)
    }
}

module.exports = DiscountController
