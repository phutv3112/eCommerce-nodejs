'use strict';

const { CREATED, SuccessResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
    signUp = async (req, res, next) => {
        new CREATED({
            message: "Register successfully",
            metadata: await AccessService.signUp(req.body)
        }).send(res)
    }
    login = async (req, res, next) => {
        new SuccessResponse({
            message: "Login successfully",
            metadata: await AccessService.login(req.body)
        }).send(res)
    }
    logout = async (req, res, next) => {
        new SuccessResponse({
            message: "Logout successfully",
            metadata: await AccessService.logout(req.keyStore)
        }).send(res)
    }
    handlerRefreshToken = async (req, res, next) => {
        new SuccessResponse({
            message: "successfully",
            metadata: await AccessService.handlerRefreshToken(req.body.refreshToken)
        }).send(res)
    }
}
module.exports = new AccessController()