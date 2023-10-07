const CheckoutController = require('../../controllers/checkout.controller')
const { asyncHandler } = require('../../helpers/asyncHandler')

const router = require('express').Router()

router.post('/review', asyncHandler(CheckoutController.checkoutReview))

module.exports = router