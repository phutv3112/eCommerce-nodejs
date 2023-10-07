'use strict';

const { SuccessResponse } = require("../core/success.response");
const ProductFactory = require("../services/product.service");

class ProductController {
    createProduct = async (req, res, next) => {
        new SuccessResponse({
            message: ' create new product successfully',
            metadata: await ProductFactory.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res)
    }
    /**
     * @desc findAllDraftsForShop
     * @param {Number} limit
     * @param {Number} skip
     * @return  {JSON} next 
     */
    findAllDraftsForShop = async (req, res, next) => {
        new SuccessResponse({
            message: ' findAllDraftsForShop successfully',
            metadata: await ProductFactory.findAllDraftsForShop({ product_shop: req.user.userId })
        }).send(res)
    }
    findAllPublishedForShop = async (req, res, next) => {
        new SuccessResponse({
            message: ' findAllPublishedForShop successfully',
            metadata: await ProductFactory.findAllPublishedForShop({ product_shop: req.user.userId })
        }).send(res)
    }
    publishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: ' publishProductByShop successfully',
            metadata: await ProductFactory.publishProductByShop({ product_shop: req.user.userId, product_id: req.params.id })
        }).send(res)
    }
    unPublishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: ' unPublishProductByShop successfully',
            metadata: await ProductFactory.unPublishProductByShop({ product_shop: req.user.userId, product_id: req.params.id })
        }).send(res)
    }
    getListProductSearch = async (req, res, next) => {
        new SuccessResponse({
            message: ' getListProductSearch successfully',
            metadata: await ProductFactory.getListProductSearch({ key: req.params.key })
        }).send(res)
    }
}
module.exports = new ProductController()