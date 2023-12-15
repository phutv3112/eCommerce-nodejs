const { NotFoundError } = require("../core/error.response");
const commentModel = require("../models/comment.model");
const { convertToObjectIdMongoDB } = require("../utils");
const { findProduct } = require('../models/repo/product.repo');

class CommentService {
    static async createComment({
        productId, userId, content, parentCommentId = null
    }) {
        const comment = new commentModel({
            comment_productId: productId,
            comment_userId: userId,
            comment_content: content,
            comment_parentId: parentCommentId
        })
        let rightValue;
        if (parentCommentId) {
            const parentComment = await commentModel.findById(parentCommentId);
            if (!parentComment) throw new NotFoundError('Parent comment not found');
            rightValue = parentComment.comment_right;

            await commentModel.updateMany({
                comment_productId: convertToObjectIdMongoDB(productId),
                comment_right: { $gte: rightValue }
            }, {
                $inc: { comment_right: 2 }
            })
            await commentModel.updateMany({
                comment_productId: convertToObjectIdMongoDB(productId),
                comment_left: { $gt: rightValue }
            }, {
                $inc: { comment_left: 2 }
            })

        } else {
            const maxRightValue = await commentModel.findOne({
                comment_productId: convertToObjectIdMongoDB(productId),
            }, 'comment_right', { sort: { comment_right: -1 } })
            if (maxRightValue) {
                rightValue = maxRightValue.right + 1;
            } else {
                rightValue = 1;
            }
        }
        // insert to comment
        comment.comment_left = rightValue;
        comment.comment_right = rightValue + 1;

        await comment.save();
        return comment;
    }
    static async getCommentsByParentId({
        productId,
        parentCommentId = null,
        limit = 50,
        offset = 0 // skip
    }) {
        if (parentCommentId) {
            const parent = await commentModel.findById(parentCommentId);
            if (!parent) throw new NotFoundError('parent comment not found!');
            const comments = await commentModel.find({
                comment_productId: convertToObjectIdMongoDB(productId),
                comment_left: { $gt: parent.comment_left },
                comment_right: { $lt: parent.comment_right },

            }).select({
                comment_right: 1,
                comment_left: 1,
                comment_content: 1,
                comment_parentId: 1,
            }).sort({
                comment_left: 1
            })
            return comments;
        } else {
            const comments = await commentModel.find({
                comment_productId: convertToObjectIdMongoDB(productId),

            }).select({
                comment_right: 1,
                comment_left: 1,
                comment_content: 1,
                comment_parentId: 1,
            }).sort({
                comment_left: 1
            })
            return comments;
        }
    }
    static async deleteComments({
        commentId, productId
    }) {
        const foundProduct = await findProduct({ product_id: productId });
        if (!foundProduct) throw new NotFoundError('Product not found');

        const comment = await commentModel.findById(commentId);
        if (!comment) throw new NotFoundError('Comment not found');

        const leftValue = comment.comment_left;
        const rightValue = comment.comment_right;

        const width = rightValue - leftValue + 1;

        await commentModel.deleteMany({
            comment_productId: convertToObjectIdMongoDB(productId),
            comment_left: { $gte: leftValue },
            comment_right: { $lte: rightValue }
        })

        await commentModel.updateMany({
            comment_productId: convertToObjectIdMongoDB(productId),
            comment_left: { $gt: rightValue }
        }, {
            $inc: { comment_left: -width }
        })

        await commentModel.updateMany({
            comment_productId: convertToObjectIdMongoDB(productId),
            comment_right: { $gt: rightValue }
        }, {
            $inc: { comment_right: -width }
        })
    }
}

module.exports = CommentService;