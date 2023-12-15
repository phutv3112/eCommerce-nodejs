'use strict';

const express = require('express');
const CommentController = require('../../controllers/comment.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const router = express.Router()

//authentication
router.use(authentication)

router.post('', asyncHandler(CommentController.createComment))
router.delete('', asyncHandler(CommentController.deleteComments))
router.get('', asyncHandler(CommentController.getListComments))

module.exports = router