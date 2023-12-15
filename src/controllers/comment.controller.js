'use strict';

const { SuccessResponse } = require("../core/success.response")
const CommentService = require("../services/comment.service")


class CommentController {
    createComment = async (req, res) => {
        new SuccessResponse({
            message: 'create new comment',
            metadata: await CommentService.createComment(req.body)
        }).send(res)
    }
    deleteComments = async (req, res) => {
        new SuccessResponse({
            message: 'delete comments',
            metadata: await CommentService.deleteComments(req.query)
        }).send(res)
    }
    getListComments = async (req, res) => {
        new SuccessResponse({
            message: 'create new comment',
            metadata: await CommentService.getCommentsByParentId(req.query)
        }).send(res)
    }

}

module.exports = new CommentController()