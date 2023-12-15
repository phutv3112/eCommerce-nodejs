const express = require('express');
const asyncHandler = require('../../helpers/asyncHandler');
const cartRouter = express.Router();
const { authentication } = require('../../auth/authUtils');
const cartController = require('../../controllers/cart.controller');


cartRouter.post('/', asyncHandler(cartController.addToCart))
cartRouter.delete('/', asyncHandler(cartController.delete))
cartRouter.post('/update', asyncHandler(cartController.updateToCart))
cartRouter.get('/', asyncHandler(cartController.listToCart))



module.exports = cartRouter