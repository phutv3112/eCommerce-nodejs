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
    findAllProducts = async (req, res) => {
        new SuccessResponse({
            message: ' findAllProduct success',
            metadata: await ProductFactory.findAllProducts(req.query)
        }).send(res)
    }

    findProduct = async (req, res) => {
        new SuccessResponse({
            message: ' findProduct success',
            metadata: await ProductFactory.findProduct({
                product_id: req.params.product_id
            })
        }).send(res)
    }
    updateProduct = async (req, res) => {
        new SuccessResponse({
            message: ' updateProduct success',
            metadata: await ProductFactory.updateProduct(req.body.product_type, req.params.product_id, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res)
    }
}
module.exports = new ProductController()