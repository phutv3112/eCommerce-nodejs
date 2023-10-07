'use strict';

const express = require('express');
const productController = require('../../controllers/product.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const router = express.Router()

router.get('/search/:key', asyncHandler(productController.getListProductSearch))
//authentication
router.use(authentication)

router.post('', asyncHandler(productController.createProduct))
router.post('/publish/:id', asyncHandler(productController.publishProductByShop))
router.post('/unPublish/:id', asyncHandler(productController.unPublishProductByShop))

router.get('/drafts/all', asyncHandler(productController.findAllDraftsForShop))
router.get('/published/all', asyncHandler(productController.findAllPublishedForShop))


module.exports = router