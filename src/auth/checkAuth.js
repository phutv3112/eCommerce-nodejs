'use strict';

const { findKeyById } = require("../services/apikey.service");

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
}
const apiKey = async (req, res, next) => {
    try {
        const key = await req.headers[HEADER.API_KEY].toString();
        if (!key) {
            return res.status(403).json({
                message: 'Forbidden'
            })
        }
        const objKey = await findKeyById(key);
        if (!objKey) {
            return res.status(403).json({
                message: 'Forbidden'
            })
        }
        req.objKey = objKey
        return next()
    } catch (error) {

    }
}
const permissions = (permission) => {
    return (req, res, next) => {
        if (!req.objKey.permissions) {
            return res.status(403).json({
                message: 'Permission denied'
            })
        }
        const validPermissions = req.objKey.permissions.includes(permission);
        if (!validPermissions) {
            return res.status(403).json({
                message: 'Permission denied'
            })
        }
        return next()
    }
}

module.exports = {
    apiKey,
    permissions,
}