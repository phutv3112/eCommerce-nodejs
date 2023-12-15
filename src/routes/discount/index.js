const express = require('express');
const asyncHandler = require('../../helpers/asyncHandler');
const router = express.Router();
const { authentication } = require('../../auth/authUtils');
const DiscountController = require('../../controllers/discount.controller');

router.post('/amount', asyncHandler(DiscountController.getDiscountAmount))
router.get('/list_product_code', asyncHandler(DiscountController.getAllDiscountCodesWithProducts))

router.use(authentication)

router.post('/', asyncHandler(DiscountController.createDiscountCode))
router.get('/', asyncHandler(DiscountController.getAllDiscountCodesByShop))


module.exports = router;