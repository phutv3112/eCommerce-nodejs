'use strict';
const jwt = require('jsonwebtoken');
const { asyncHandler } = require('../helpers/asyncHandler');
const { UnauthorizedError, NotFoundError } = require('../core/error.response');
const KeyTokenService = require('../services/keytoken.service');

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
}

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = await jwt.sign(payload, publicKey, {
            expiresIn: '1 day',
        })
        const refreshToken = await jwt.sign(payload, privateKey, {
            expiresIn: '7 days',
        })
        jwt.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.log('error verify:', err)
            } else {
                console.log('decoded::', decode)
            }
        })
        return { accessToken, refreshToken }
    } catch (error) {
        return null
    }
}
const verifyJwt = (token, key) => {
    return jwt.verify(token, key)
}
const authentication = asyncHandler(async (req, res, next) => {
    const userId = req.headers[HEADER.CLIENT_ID]
    if (!userId) throw new UnauthorizedError('Invalid request')
    const keyStore = await KeyTokenService.findByUserId(userId)
    if (!keyStore) throw new NotFoundError('keyStore not found')

    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if (!accessToken) throw new UnauthorizedError('Invalid Request')
    try {
        const decode = jwt.verify(accessToken, keyStore.publicKey)
        if (userId !== decode.userId) throw new UnauthorizedError('Invalid User')
        req.keyStore = keyStore
        return next()
    } catch (error) {
        throw error
    }
})
module.exports = {
    createTokenPair,
    authentication,
    verifyJwt
}