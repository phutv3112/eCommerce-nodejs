'use strict';

const express = require('express');
const accessController = require('../../controllers/access.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const router = express.Router()

router.post('/shop/signup', asyncHandler(accessController.signUp))
router.post('/shop/login', asyncHandler(accessController.login))

//authentication
// router.use(authentication)
router.post('/shop/logout', authentication, asyncHandler(accessController.logout))
router.post('/shop/refresh-token', authentication, asyncHandler(accessController.handlerRefreshToken))


module.exports = router